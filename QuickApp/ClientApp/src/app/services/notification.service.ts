// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, flatMap, startWith } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { NotificationEndpoint } from './notification-endpoint.service';
import { Notification } from '../models/notification.model';

@Injectable()
export class NotificationService {

  private lastNotificationDate: Date;
  private _recentNotifications: Notification[];

  get currentUser() {
    return this.authService.currentUser;
  }

  get recentNotifications() {
    return this._recentNotifications;
  }

  set recentNotifications(notifications: Notification[]) {
    this._recentNotifications = notifications;
  }



  constructor(private notificationEndpoint: NotificationEndpoint, private authService: AuthService) {

  }


  getNotification(notificationId?: number) {

    return this.notificationEndpoint.getNotificationEndpoint(notificationId).pipe(
      map(response => Notification.Create(response)));
  }


  getNotifications(page: number, pageSize: number) {

    return this.notificationEndpoint.getNotificationsEndpoint(page, pageSize).pipe(
      map(response => {
        return this.getNotificationsFromResponse(response);
      }));
  }


  getUnreadNotifications(userId?: string) {

    return this.notificationEndpoint.getUnreadNotificationsEndpoint(userId).pipe(
      map(response => this.getNotificationsFromResponse(response)));
  }


  getNewNotifications() {
    return this.notificationEndpoint.getNewNotificationsEndpoint(this.lastNotificationDate).pipe(
      map(response => this.processNewNotificationsFromResponse(response)));
  }


  getNewNotificationsPeriodically() {
    return interval(10000).pipe(
      startWith(0),
      flatMap(() => {
        return this.notificationEndpoint.getNewNotificationsEndpoint(this.lastNotificationDate).pipe(
          map(response => this.processNewNotificationsFromResponse(response)));
      }));
  }




  pinUnpinNotification(notificationOrNotificationId: number | Notification, isPinned?: boolean): Observable<any> {

    if (typeof notificationOrNotificationId === 'number' || notificationOrNotificationId instanceof Number) {
      return this.notificationEndpoint.getPinUnpinNotificationEndpoint(<number>notificationOrNotificationId, isPinned);
    } else {
      return this.pinUnpinNotification(notificationOrNotificationId.id);
    }
  }


  readUnreadNotification(notificationIds: number[], isRead: boolean): Observable<any> {

    return this.notificationEndpoint.getReadUnreadNotificationEndpoint(notificationIds, isRead);
  }




  deleteNotification(notificationOrNotificationId: number | Notification): Observable<Notification> {

    if (typeof notificationOrNotificationId === 'number' || notificationOrNotificationId instanceof Number) { // Todo: Test me if its check is valid
      return this.notificationEndpoint.getDeleteNotificationEndpoint(<number>notificationOrNotificationId).pipe(
        map(response => {
          this.recentNotifications = this.recentNotifications.filter(n => n.id != notificationOrNotificationId);
          return Notification.Create(response);
        }));
    } else {
      return this.deleteNotification(notificationOrNotificationId.id);
    }
  }




  private processNewNotificationsFromResponse(response) {
    const notifications = this.getNotificationsFromResponse(response);

    for (const n of notifications) {
      if (n.date > this.lastNotificationDate) {
        this.lastNotificationDate = n.date;
      }
    }

    return notifications;
  }


  private getNotificationsFromResponse(response) {
    const notifications: Notification[] = [];

    for (const i in response) {
      notifications[i] = Notification.Create(response[i]);
    }

    notifications.sort((a, b) => b.date.valueOf() - a.date.valueOf());
    notifications.sort((a, b) => (a.isPinned === b.isPinned) ? 0 : a.isPinned ? -1 : 1);

    this.recentNotifications = notifications;

    return notifications;
  }
}
