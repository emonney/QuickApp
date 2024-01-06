// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableColumn } from '@swimlane/ngx-datatable';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { NotificationService } from '../../services/notification.service';
import { AccountService } from '../../services/account.service';
import { Permission } from '../../models/permission.model';
import { Utilities } from '../../services/utilities';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notifications-viewer',
  templateUrl: './notifications-viewer.component.html',
  styleUrls: ['./notifications-viewer.component.scss']
})
export class NotificationsViewerComponent implements OnInit, OnDestroy {
  columns: TableColumn[] = [];
  rows: Notification[] = [];
  loadingIndicator = false;

  dataLoadingConsecutiveFailurs = 0;
  dataLoadingSubscription: Subscription | undefined;

  @Input()
  isViewOnly = false;

  @Input()
  verticalScrollbar = false;


  @ViewChild('statusHeaderTemplate', { static: true })
  statusHeaderTemplate!: TemplateRef<unknown>;

  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<unknown>;

  @ViewChild('dateTemplate', { static: true })
  dateTemplate!: TemplateRef<unknown>;

  @ViewChild('contentHeaderTemplate', { static: true })
  contentHeaderTemplate!: TemplateRef<unknown>;

  @ViewChild('contenBodytTemplate', { static: true })
  contenBodytTemplate!: TemplateRef<unknown>;

  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate!: TemplateRef<unknown>;

  constructor(private alertService: AlertService, private translationService: AppTranslationService,
    private accountService: AccountService, private notificationService: NotificationService) {
  }

  ngOnInit() {
    if (this.isViewOnly) {
      this.columns = [
        { prop: 'header', cellTemplate: this.contentHeaderTemplate, width: 200, resizeable: false, sortable: false, draggable: false },
      ];
    } else {
      const gT = (key: string) => this.translationService.getTranslation(key);

      this.columns = [
        { prop: '', name: '', width: 10, headerTemplate: this.statusHeaderTemplate, cellTemplate: this.statusTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
        { prop: 'date', name: gT('notifications.Date'), cellTemplate: this.dateTemplate, width: 30 },
        { prop: 'body', name: gT('notifications.Notification'), cellTemplate: this.contenBodytTemplate, width: 500 },
        { name: '', width: 80, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
      ];
    }

    this.initDataLoading();
  }

  ngOnDestroy() {
    this.dataLoadingSubscription?.unsubscribe();
  }

  initDataLoading() {
    if (this.isViewOnly && this.notificationService.newNotifications) {
      this.rows = this.processResults(this.notificationService.newNotifications);
      return;
    }

    this.loadingIndicator = true;

    this.dataLoadingSubscription = (this.isViewOnly ?
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
    if (this.isViewOnly) {
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
    return this.accountService.userHasPermission(Permission.manageRoles); // Todo: Create separate permissions for notifications
  }
}
