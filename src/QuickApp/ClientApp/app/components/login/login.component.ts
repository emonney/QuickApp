// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit, OnDestroy, Input } from "@angular/core";

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AuthService } from "../../services/auth.service";
import { ConfigurationService } from '../../services/configuration.service';
import { Utilities } from '../../services/utilities';
import { UserLogin } from '../../models/user-login.model';
import { AppTranslationService } from "../../services/app-translation.service";

@Component({
    selector: "app-login",
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

    userLogin = new UserLogin();
    isLoading = false;
    formResetToggle = true;
    modalClosedCallback: () => void;
    loginStatusSubscription: any;

    @Input()
    isModal = false;


    constructor(private alertService: AlertService, private authService: AuthService, private configurations: ConfigurationService, private translationService: AppTranslationService) {

    }


    ngOnInit() {

        this.userLogin.rememberMe = this.authService.rememberMe;

        if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
        }
        else {
            this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
                if (this.getShouldRedirect()) {
                    this.authService.redirectLoginUser();
                }
            });
        }
    }


    ngOnDestroy() {
        if (this.loginStatusSubscription)
            this.loginStatusSubscription.unsubscribe();
    }


    getShouldRedirect() {
        return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
    }


    showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(this.translationService.getTranslation(caption), this.translationService.getTranslation(message), MessageSeverity.error);
    }

    closeModal() {
        if (this.modalClosedCallback) {
            this.modalClosedCallback();
        }
    }


    login() {
        this.isLoading = true;
        this.alertService.startLoadingMessage(this.translationService.getTranslation("app.StartLoadingMessage"), this.translationService.getTranslation("app.StartLoadingMessageCaption"));

        this.authService.login(this.userLogin.email, this.userLogin.password, this.userLogin.rememberMe)
            .subscribe(
            user => {
                setTimeout(() => {
                    this.alertService.stopLoadingMessage();
                    this.isLoading = false;
                    this.reset();

                    if (!this.isModal) {
                        this.alertService.showMessage(this.translationService.getTranslation("app.Login"), `${this.translationService.getTranslation("app.Welcome")} ${user.userName}!`, MessageSeverity.success);
                    }
                    else {
                        this.alertService.showMessage(this.translationService.getTranslation("app.Login"), `${this.translationService.getTranslation("app.SessionRestoredFor")} ${user.userName}!`, MessageSeverity.success);
                        setTimeout(() => {
                            this.alertService.showStickyMessage(this.translationService.getTranslation("app.SessionRestored"), this.translationService.getTranslation("app.TryYourOperationAgain"), MessageSeverity.default);
                        }, 500);

                        this.closeModal();
                    }
                }, 500);
            },
            error => {

                this.alertService.stopLoadingMessage();

                if (Utilities.checkNoNetwork(error)) {
                    this.alertService.showStickyMessage(this.translationService.getTranslation(Utilities.noNetworkMessageCaption), this.translationService.getTranslation(Utilities.noNetworkMessageDetail), MessageSeverity.error, error);
                    this.offerAlternateHost();
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);

                    if (errorMessage)
                        this.alertService.showStickyMessage(this.translationService.getTranslation("app.UnableToLogin"), errorMessage, MessageSeverity.error, error);
                    else
                        this.alertService.showStickyMessage(this.translationService.getTranslation("app.UnableToLogin"), this.translationService.getTranslation("app.AnErrorOccuredWhilstLoggingInTryAgainLater") + error.statusText || error.status, MessageSeverity.error, error);
                }

                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            });
    }


    offerAlternateHost() {
        if (Utilities.checkIsLocalHost(location.origin) && Utilities.checkIsLocalHost(this.configurations.baseUrl)) {
            this.alertService.showDialog(this.translationService.getTranslation("app.BackendServiceNotRunning"),
                DialogType.prompt,
                (value: string) => {
                    this.configurations.baseUrl = value;
                    this.alertService.showStickyMessage(this.translationService.getTranslation("app.APIChanged"), this.translationService.getTranslation("app.TargetAPIChanged")  + value, MessageSeverity.warn);
                },
                null,
                null,
                null,
                this.configurations.fallbackBaseUrl);
        }
    }


    reset() {
        this.formResetToggle = false;

        setTimeout(() => {
            this.formResetToggle = true;
        });
    }
}
