// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Injectable, inject } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { NotificationEndpoint } from './notification-endpoint.service';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationEndpoint = inject(NotificationEndpoint);
  private authService = inject(AuthService);

  private lastNotificationDate: Date | undefined;
  private _newNotifications: Notification[] | undefined;

  get currentUser() {
    return this.authService.currentUser;
  }

  get newNotifications() {
    return this._newNotifications;
  }

  getNotification(notificationId: number) {
    return this.notificationEndpoint.getNotificationEndpoint<Notification>(notificationId).pipe(
      map(response => response ? Notification.Create(response) : null));
  }

  getNotifications(page: number, pageSize: number) {
    return this.notificationEndpoint.getNotificationsEndpoint<Notification[]>(page, pageSize).pipe(
      map(response => {
        return this.getNotificationsFromResponse(response);
      }));
  }

  getUnreadNotifications(userId?: string) {
    return this.notificationEndpoint.getUnreadNotificationsEndpoint<Notification[]>(userId).pipe(
      map(response => this.getNotificationsFromResponse(response)));
  }

  getNewNotifications() {
    return this.notificationEndpoint.getNewNotificationsEndpoint<Notification[]>(this.lastNotificationDate).pipe(
      map(response => this.processNewNotificationsFromResponse(response)));
  }

  getNewNotificationsPeriodically() {
    return interval(10000).pipe(
      startWith(0),
      mergeMap(() => {
        return this.notificationEndpoint.getNewNotificationsEndpoint<Notification[]>(this.lastNotificationDate).pipe(
          map(response => this.processNewNotificationsFromResponse(response)));
      }));
  }

  private processNewNotificationsFromResponse(response: object[] | null) {
    const notifications = this.getNotificationsFromResponse(response);

    for (const n of notifications) {
      if (!this.lastNotificationDate || n.date > this.lastNotificationDate)
        this.lastNotificationDate = n.date;
    }

    this._newNotifications = notifications;

    return notifications;
  }

  pinUnpinNotification(notification: number | Notification, isPinned?: boolean): Observable<null> {
    if (typeof notification === 'number') {
      return this.notificationEndpoint.getPinUnpinNotificationEndpoint(notification, isPinned);
    } else {
      return this.pinUnpinNotification(notification.id);
    }
  }

  readUnreadNotification(notificationIds: number[], isRead: boolean) {
    return this.notificationEndpoint.getReadUnreadNotificationEndpoint(notificationIds, isRead);
  }

  deleteNotification(notification: number | Notification): Observable<Notification | null> {
    if (typeof notification === 'number') {
      return this.notificationEndpoint.getDeleteNotificationEndpoint<Notification>(notification).pipe(
        map(response => {
          if (response) {
            this._newNotifications = this.newNotifications?.filter(n => n.id !== notification);
            return Notification.Create(response);
          }
          return null;
        }));
    } else {
      return this.deleteNotification(notification.id);
    }
  }

  private getNotificationsFromResponse(response: object[] | null) {
    if (!response)
      return [];

    const notifications: Notification[] = [];

    for (const i in response) {
      if (Object.prototype.hasOwnProperty.call(response, i)) {
        notifications[+i] = Notification.Create(response[i]);
      }
    }

    notifications.sort((a, b) => b.date.valueOf() - a.date.valueOf());
    notifications.sort((a, b) => (a.isPinned === b.isPinned) ? 0 : a.isPinned ? -1 : 1);

    return notifications;
  }
}
