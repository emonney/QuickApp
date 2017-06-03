// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, Input } from '@angular/core';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { NotificationService } from "../../services/notification.service";
import { AccountService } from "../../services/account.service";
import { Permission } from '../../models/permission.model';
import { Utilities } from "../../services/utilities";
import { Notification } from '../../models/notification.model';


@Component({
    selector: 'notifications-viewer',
    templateUrl: './notifications-viewer.component.html',
    styleUrls: ['./notifications-viewer.component.css']
})
export class NotificationsViewerComponent implements OnInit, OnDestroy {
    columns: any[] = [];
    rows: Notification[] = [];
    loadingIndicator: boolean;

    dataLoadingConsecutiveFailurs = 0;
    dataLoadingSubscription: any;


    @Input()
    isViewOnly: boolean;

    @Input()
    verticalScrollbar: boolean = false;


    @ViewChild('statusHeaderTemplate')
    statusHeaderTemplate: TemplateRef<any>;

    @ViewChild('statusTemplate')
    statusTemplate: TemplateRef<any>;

    @ViewChild('dateTemplate')
    dateTemplate: TemplateRef<any>;

    @ViewChild('contentHeaderTemplate')
    contentHeaderTemplate: TemplateRef<any>;

    @ViewChild('contenBodytTemplate')
    contenBodytTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService, private notificationService: NotificationService) {
    }


    ngOnInit() {

        if (this.isViewOnly) {
            this.columns = [
                { prop: 'date', cellTemplate: this.dateTemplate, width: 100, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
                { prop: 'header', cellTemplate: this.contentHeaderTemplate, width: 200, resizeable: false, sortable: false, draggable: false },
            ];
        }
        else {
            let gT = (key: string) => this.translationService.getTranslation(key);

            this.columns = [
                { prop: "", name: '', width: 10, headerTemplate: this.statusHeaderTemplate, cellTemplate: this.statusTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
                { prop: 'date', name: gT('notifications.Date'), cellTemplate: this.dateTemplate, width: 30 },
                { prop: 'body', name: gT('notifications.Notification'), cellTemplate: this.contenBodytTemplate, width: 500 },
                { name: '', width: 80, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
            ];
        }


        this.initDataLoading();
    }


    ngOnDestroy() {
        if (this.dataLoadingSubscription)
            this.dataLoadingSubscription.unsubscribe();
    }



    initDataLoading() {

        if (this.isViewOnly && this.notificationService.recentNotifications) {
            this.rows = this.processResults(this.notificationService.recentNotifications);
            return;
        }


        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        let dataLoadTask = this.isViewOnly ? this.notificationService.getNewNotifications() : this.notificationService.getNewNotificationsPeriodically()

        this.dataLoadingSubscription = dataLoadTask
            .subscribe(notifications => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.dataLoadingConsecutiveFailurs = 0;

                this.rows = this.processResults(notifications);
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showMessage("Load Error", "Loading new notifications from the server failed!", MessageSeverity.warn);
                this.alertService.logError(error);

                if (this.dataLoadingConsecutiveFailurs++ < 5)
                    setTimeout(() => this.initDataLoading(), 5000);
                else
                    this.alertService.showStickyMessage("Load Error", "Loading new notifications from the server failed!", MessageSeverity.error);

            });


        if (this.isViewOnly)
            this.dataLoadingSubscription = null;
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
        if (value)
            return Utilities.printTimeOnly(value) + " on " + Utilities.printDateOnly(value);
    }


    deleteNotification(row: Notification) {
        this.alertService.showDialog('Are you sure you want to delete the notification \"' + row.header + '\"?', DialogType.confirm, () => this.deleteNotificationHelper(row));
    }


    deleteNotificationHelper(row: Notification) {

        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.notificationService.deleteNotification(row)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rows = this.rows.filter(item => item.id != row.id)
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst deleting the notification.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }


    togglePin(row: Notification) {

        let pin = !row.isPinned;
        let opText = pin ? "Pinning" : "Unpinning";

        this.alertService.startLoadingMessage(opText + "...");
        this.loadingIndicator = true;

        this.notificationService.pinUnpinNotification(row, pin)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                row.isPinned = pin;
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage(opText + " Error", `An error occured whilst ${opText} the notification.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }


    get canManageNotifications() {
        return this.accountService.userHasPermission(Permission.manageRolesPermission); //Todo: Consider creating separate permission for notifications
    }

}
