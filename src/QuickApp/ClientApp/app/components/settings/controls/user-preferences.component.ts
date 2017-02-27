// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// ======================================

import { Component, ViewChild } from '@angular/core';

import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { AccountService } from '../../../services/account.service';
import { Utilities } from '../../../services/utilities';


@Component({
    selector: 'user-preferences',
    templateUrl: './user-preferences.component.html',
    styleUrls: ['./user-preferences.component.css']
})
export class UserPreferencesComponent {

    constructor(private alertService: AlertService, private configurations: ConfigurationService, private accountService: AccountService) {
    }



    reloadFromServer() {
        this.alertService.startLoadingMessage();

        this.accountService.getUserPreferences()
            .subscribe(results => {
                this.alertService.stopLoadingMessage();

                this.configurations.import(results);

                this.alertService.showMessage("Defaults loaded!", "", MessageSeverity.info);

            },
            error => {
                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Load Error", `Unable to retrieve user preferences from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }

    setAsDefault() {
        this.alertService.showDialog("Are you sure you want to set the current configuration as your new defaults?", DialogType.confirm,
            () => this.setAsDefaultHelper(),
            () => this.alertService.showMessage("Operation Cancelled!", "", MessageSeverity.default));
    }

    setAsDefaultHelper() {
        this.alertService.startLoadingMessage("", "Saving new defaults");

        this.accountService.updateUserPreferences(this.configurations.export())
            .subscribe(response => {
                this.alertService.stopLoadingMessage();
                this.alertService.showMessage("New Defaults", "Account defaults updated successfully", MessageSeverity.success)

            },
            error => {
                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Save Error", `An error occured whilst saving configuration defaults.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }



    resetDefault() {
        this.alertService.showDialog("Are you sure you want to reset your defaults?", DialogType.confirm,
            () => this.resetDefaultHelper(),
            () => this.alertService.showMessage("Operation Cancelled!", "", MessageSeverity.default));
    }

    resetDefaultHelper() {
        this.alertService.startLoadingMessage("", "Resetting defaults");

        this.accountService.updateUserPreferences(null)
            .subscribe(response => {
                this.alertService.stopLoadingMessage();
                this.configurations.import(null);
                this.alertService.showMessage("Defaults Reset", "Account defaults reset completed successfully", MessageSeverity.success)

            },
            error => {
                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Save Error", `An error occured whilst resetting configuration defaults.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }
}
