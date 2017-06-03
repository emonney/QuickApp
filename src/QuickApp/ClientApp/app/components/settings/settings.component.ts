// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { fadeInOut } from '../../services/animations';
import { BootstrapTabDirective } from "../../directives/bootstrap-tab.directive";
import { AppTranslationService } from "../../services/app-translation.service";
import { AccountService, RolesChangedEventArg } from "../../services/account.service";
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    animations: [fadeInOut]
})
export class SettingsComponent implements OnInit, OnDestroy {

    isProfileActived = true;
    isPreferencesActived = false;
    isUsersActived = false;
    isRolesActived = false;

    fragmentSubscription: any;
    languageChangedSubscription: any;
    rolesChangedSubscription: any;

    readonly profileTab = "profile";
    readonly preferencesTab = "preferences";
    readonly usersTab = "users";
    readonly rolesTab = "roles";

    activeTab: string = this.profileTab;


    @ViewChild("tab")
    tab: BootstrapTabDirective;


    constructor(private route: ActivatedRoute, private translationService: AppTranslationService, private accountService: AccountService) {
    }


    ngOnInit() {
        this.fragmentSubscription = this.route.fragment.subscribe(anchor => this.showContent(anchor));
        this.languageChangedSubscription = this.translationService.languageChangedEvent().subscribe(data => this.handleLanguageChangedEvent());
        this.rolesChangedSubscription = this.accountService.getRolesChangedEvent().subscribe(data => this.handleRolesChangedEvent(data));
    }


    ngOnDestroy() {
        this.fragmentSubscription.unsubscribe();
        this.languageChangedSubscription.unsubscribe();
        this.rolesChangedSubscription.unsubscribe();
    }


    handleLanguageChangedEvent() {

        if (this.activeTab != this.usersTab)
            this.isUsersActived = false;

        if (this.activeTab != this.rolesTab)
            this.isRolesActived = false;
    }



    handleRolesChangedEvent(eventArg: RolesChangedEventArg) {

        switch (eventArg.operation) {
            case AccountService.roleAddedOperation:
            case AccountService.roleDeletedOperation:
            case AccountService.roleModifiedOperation:

                if (this.activeTab != this.profileTab)
                    this.isProfileActived = false;

                if (this.activeTab != this.usersTab)
                    this.isUsersActived = false;

                if (this.activeTab != this.rolesTab)
                    this.isRolesActived = false;

                break;
            default:
                throw new Error("Unknown RolesChangedOperation: " + eventArg.operation);
        }
    }

    showContent(anchor: string) {
        if ((anchor == this.usersTab && !this.canViewUsers) || (anchor == this.rolesTab && !this.canViewRoles))
            return;

        this.tab.show(`#${anchor || this.profileTab}Tab`);
    }


    onShowTab(event) {
        this.setActiveTab(event.target.hash);

        switch (this.activeTab) {
            case this.profileTab:
                this.isProfileActived = true;
                break;
            case this.preferencesTab:
                this.isPreferencesActived = true;
                break;
            case this.usersTab:
                this.isUsersActived = true;
                break;
            case this.rolesTab:
                this.isRolesActived = true;
                break;
            default:
                throw new Error("Selected bootstrap tab is unknown. Selected Tab: " + this.activeTab);
        }
    }


    setActiveTab(tab: string) {
        this.activeTab = tab.split("#", 2).pop();
    }


    get canViewUsers() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission);
    }

    get canViewRoles() {
        return this.accountService.userHasPermission(Permission.viewRolesPermission);
    }
}
