// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Injectable } from '@angular/core';
import { HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { Utilities } from '../services/utilities';



@Injectable()
export class AlertService {

    private messages = new Subject<AlertMessage>();
    private stickyMessages = new Subject<AlertMessage>();
    private dialogs = new Subject<AlertDialog>();

    private _isLoading = false;
    private loadingMessageId: any;



    showDialog(message: string)
    showDialog(message: string, type: DialogType, okCallback: (val?: any) => any)
    showDialog(message: string, type: DialogType, okCallback?: (val?: any) => any, cancelCallback?: () => any, okLabel?: string, cancelLabel?: string, defaultValue?: string)
    showDialog(message: string, type?: DialogType, okCallback?: (val?: any) => any, cancelCallback?: () => any, okLabel?: string, cancelLabel?: string, defaultValue?: string) {

        if (!type)
            type = DialogType.alert;

        this.dialogs.next({ message: message, type: type, okCallback: okCallback, cancelCallback: cancelCallback, okLabel: okLabel, cancelLabel: cancelLabel, defaultValue: defaultValue });
    }



    showMessage(summary: string)
    showMessage(summary: string, detail: string, severity: MessageSeverity)
    showMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity)
    showMessage(response: HttpResponseBase, ignoreValue_useNull: string, severity: MessageSeverity)
    showMessage(data: any, separatorOrDetail?: string, severity?: MessageSeverity) {

        if (!severity)
            severity = MessageSeverity.default;

        if (data instanceof HttpResponseBase) {
            data = Utilities.getHttpResponseMessage(data);
            separatorOrDetail = Utilities.captionAndMessageSeparator;
        }

        if (data instanceof Array) {
            for (let message of data) {
                let msgObject = Utilities.splitInTwo(message, separatorOrDetail);

                this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, false);
            }
        }
        else {
            this.showMessageHelper(data, separatorOrDetail, severity, false);
        }
    }


    showStickyMessage(summary: string)
    showStickyMessage(summary: string, detail: string, severity: MessageSeverity, error?: any)
    showStickyMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity)
    showStickyMessage(response: HttpResponseBase, ignoreValue_useNull: string, severity: MessageSeverity)
    showStickyMessage(data: string | string[] | HttpResponseBase, separatorOrDetail?: string, severity?: MessageSeverity, error?: any) {

        if (!severity)
            severity = MessageSeverity.default;

        if (data instanceof HttpResponseBase) {
            data = Utilities.getHttpResponseMessage(data);
            separatorOrDetail = Utilities.captionAndMessageSeparator;
        }


        if (data instanceof Array) {
            for (let message of data) {
                let msgObject = Utilities.splitInTwo(message, separatorOrDetail);

                this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, true);
            }
        }
        else {

            if (error) {

                let msg = `Severity: "${MessageSeverity[severity]}", Summary: "${data}", Detail: "${separatorOrDetail}", Error: "${Utilities.safeStringify(error)}"`;

                switch (severity) {
                    case MessageSeverity.default:
                        this.logInfo(msg);
                        break;
                    case MessageSeverity.info:
                        this.logInfo(msg);
                        break;
                    case MessageSeverity.success:
                        this.logMessage(msg);
                        break;
                    case MessageSeverity.error:
                        this.logError(msg);
                        break;
                    case MessageSeverity.warn:
                        this.logWarning(msg);
                        break;
                    case MessageSeverity.wait:
                        this.logTrace(msg);
                        break;
                }
            }

            this.showMessageHelper(data, separatorOrDetail, severity, true);
        }
    }



    private showMessageHelper(summary: string, detail: string, severity: MessageSeverity, isSticky: boolean) {

        if (isSticky)
            this.stickyMessages.next({ severity: severity, summary: summary, detail: detail });
        else
            this.messages.next({ severity: severity, summary: summary, detail: detail });
    }



    startLoadingMessage(message = "Loading...", caption = "") {
        this._isLoading = true;
        clearTimeout(this.loadingMessageId);

        this.loadingMessageId = setTimeout(() => {
            this.showStickyMessage(caption, message, MessageSeverity.wait);
        }, 1000);
    }

    stopLoadingMessage() {
        this._isLoading = false;
        clearTimeout(this.loadingMessageId);
        this.resetStickyMessage();
    }



    logDebug(msg) {
        console.debug(msg);
    }

    logError(msg) {
        console.error(msg);
    }

    logInfo(msg) {
        console.info(msg);
    }

    logMessage(msg) {
        console.log(msg);
    }

    logTrace(msg) {
        console.trace(msg);
    }

    logWarning(msg) {
        console.warn(msg);
    }




    resetStickyMessage() {
        this.stickyMessages.next();
    }




    getDialogEvent(): Observable<AlertDialog> {
        return this.dialogs.asObservable();
    }


    getMessageEvent(): Observable<AlertMessage> {
        return this.messages.asObservable();
    }

    getStickyMessageEvent(): Observable<AlertMessage> {
        return this.stickyMessages.asObservable();
    }



    get isLoadingInProgress(): boolean {
        return this._isLoading;
    }
}







//******************** Dialog ********************//
export class AlertDialog {
    constructor(public message: string, public type: DialogType, public okCallback: (val?: any) => any, public cancelCallback: () => any,
        public defaultValue: string, public okLabel: string, public cancelLabel: string) {

    }
}

export enum DialogType {
    alert,
    confirm,
    prompt
}
//******************** End ********************//






//******************** Growls ********************//
export class AlertMessage {
    constructor(public severity: MessageSeverity, public summary: string, public detail: string) { }
}

export enum MessageSeverity {
    default,
    info,
    success,
    error,
    warn,
    wait
}
//******************** End ********************//
