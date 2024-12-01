// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component, OnInit, OnDestroy, TemplateRef, inject, input, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { TableColumn, NgxDatatableModule } from '@siemens/ngx-datatable';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { NotificationService } from '../../services/notification.service';
import { AccountService } from '../../services/account.service';
import { Permissions } from '../../models/permission.model';
import { Utilities } from '../../services/utilities';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notifications-viewer',
  templateUrl: './notifications-viewer.component.html',
  styleUrl: './notifications-viewer.component.scss',
  imports: [NgxDatatableModule, NgbTooltip, NgClass, TranslateModule]
})
export class NotificationsViewerComponent implements OnInit, OnDestroy {
  private alertService = inject(AlertService);
  private translationService = inject(AppTranslationService);
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);

  columns: TableColumn[] = [];
  rows: Notification[] = [];
  loadingIndicator = false;

  dataLoadingConsecutiveFailurs = 0;
  dataLoadingSubscription: Subscription | undefined;

  readonly isViewOnly = input(false);
  readonly verticalScrollbar = input(false);

  readonly statusHeaderTemplate = viewChild.required<TemplateRef<unknown>>('statusHeaderTemplate');

  readonly statusTemplate = viewChild.required<TemplateRef<unknown>>('statusTemplate');

  readonly dateTemplate = viewChild.required<TemplateRef<unknown>>('dateTemplate');

  readonly contentHeaderTemplate = viewChild.required<TemplateRef<unknown>>('contentHeaderTemplate');

  readonly contenBodytTemplate = viewChild.required<TemplateRef<unknown>>('contenBodytTemplate');

  readonly actionsTemplate = viewChild.required<TemplateRef<unknown>>('actionsTemplate');

  ngOnInit() {
    if (this.isViewOnly()) {
      this.columns = [
        { prop: 'header', cellTemplate: this.contentHeaderTemplate(), width: 200, resizeable: false, sortable: false, draggable: false },
      ];
    } else {
      const gT = (key: string) => this.translationService.getTranslation(key);

      this.columns = [
        { prop: '', name: '', width: 10, headerTemplate: this.statusHeaderTemplate(), cellTemplate: this.statusTemplate(), resizeable: false, canAutoResize: false, sortable: false, draggable: false },
        { prop: 'date', name: gT('notifications.Date'), cellTemplate: this.dateTemplate(), width: 30 },
        { prop: 'body', name: gT('notifications.Notification'), cellTemplate: this.contenBodytTemplate(), width: 500 },
        { name: '', width: 80, cellTemplate: this.actionsTemplate(), resizeable: false, canAutoResize: false, sortable: false, draggable: false }
      ];
    }

    this.initDataLoading();
  }

  ngOnDestroy() {
    this.dataLoadingSubscription?.unsubscribe();
  }

  initDataLoading() {
    const isViewOnly = this.isViewOnly();
    if (isViewOnly && this.notificationService.newNotifications) {
      this.rows = this.processResults(this.notificationService.newNotifications);
      return;
    }

    this.loadingIndicator = true;

    this.dataLoadingSubscription = (isViewOnly ?
      this.notificationService.getNewNotifications() : this.notificationService.getNewNotificationsPeriodically())
      .subscribe({
        next: notifications => {
          this.loadingIndicator = false;
          this.dataLoadingConsecutiveFailurs = 0;

          this.rows = this.processResults(notifications);
        },
        error: error => {
          this.loadingIndicator = false;

          this.alertService.showMessage('Load Error', 'Loading new notifications from the server failed!', MessageSeverity.warn);
          this.alertService.logError(error);

          if (this.dataLoadingConsecutiveFailurs++ < 5) {
            setTimeout(() => this.initDataLoading(), 5000);
          } else {
            this.alertService.showStickyMessage('Load Error', 'Loading new notifications from the server failed!', MessageSeverity.error);
          }
        }
      });
  }

  private processResults(notifications: Notification[]) {
    if (this.isViewOnly()) {
      notifications.sort((a, b) => {
        return b.date.valueOf() - a.date.valueOf();
      });
    }

    return notifications;
  }

  getPrintedDate(value: Date) {
    if (value) {
      return Utilities.printTimeOnly(value) + ' on ' + Utilities.printDateOnly(value);
    }

    return '';
  }

  deleteNotification(row: Notification) {
    this.alertService.showDialog(`Are you sure you want to delete the notification "${row.header}"?`,
      DialogType.confirm, () => this.deleteNotificationHelper(row));
  }

  deleteNotificationHelper(row: Notification) {
    this.alertService.startLoadingMessage('Deleting...');
    this.loadingIndicator = true;

    this.notificationService.deleteNotification(row)
      .subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.rows = this.rows.filter(item => item.id !== row.id);
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.alertService.showStickyMessage('Delete Error',
            `An error occurred whilst deleting the notification.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
        }
      });
  }

  togglePin(row: Notification) {
    const pin = !row.isPinned;
    const opText = pin ? 'Pinning' : 'Unpinning';

    this.alertService.startLoadingMessage(opText + '...');
    this.loadingIndicator = true;

    this.notificationService.pinUnpinNotification(row, pin)
      .subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          row.isPinned = pin;
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.alertService.showStickyMessage(opText + ' Error',
            `An error occurred whilst ${opText} the notification.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
        }
      });
  }

  get canManageNotifications() {
    return this.accountService.userHasPermission(Permissions.manageRoles); // Todo: Create separate permissions for notifications
  }
}
