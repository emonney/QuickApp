// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { fadeInOut } from '../../services/animations';
import { BootstrapTabDirective, EventArg } from '../../directives/bootstrap-tab.directive';
import { AccountService } from '../../services/account.service';
import { Permission } from '../../models/permission.model';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [fadeInOut]
})
export class SettingsComponent implements OnInit, OnDestroy {
  isProfileActivated = true;
  isPreferencesActivated = false;
  isUsersActivated = false;
  isRolesActivated = false;

  fragmentSubscription: Subscription | undefined;

  readonly profileTab = 'profile';
  readonly preferencesTab = 'preferences';
  readonly usersTab = 'users';
  readonly rolesTab = 'roles';

  @ViewChild('tab', { static: true })
  tab!: BootstrapTabDirective;


  constructor(private router: Router, private route: ActivatedRoute, private accountService: AccountService) {
  }

  ngOnInit() {
    this.fragmentSubscription = this.route.fragment.subscribe(anchor => this.showContent(anchor));
  }

  ngOnDestroy() {
    this.fragmentSubscription?.unsubscribe();
  }

  showContent(anchor: string | null) {
    if (anchor) {
      anchor = anchor.toLowerCase();
    }

    if ((this.isFragmentEquals(anchor, this.usersTab) && !this.canViewUsers) ||
      (this.isFragmentEquals(anchor, this.rolesTab) && !this.canViewRoles)) {
      return;
    }

    this.tab.show(`#${anchor || this.profileTab}Tab`);
  }

  isFragmentEquals(fragment1: string | null, fragment2: string | null) {
    if (fragment1 == null) {
      fragment1 = '';
    }

    if (fragment2 == null) {
      fragment2 = '';
    }

    return fragment1.toLowerCase() === fragment2.toLowerCase();
  }

  onShowTab(event: EventArg) {
    const activeTab = (event.target as HTMLAnchorElement).hash.split('#', 2).pop();

    this.isProfileActivated = activeTab === this.profileTab;
    this.isPreferencesActivated = activeTab === this.preferencesTab;
    this.isUsersActivated = activeTab === this.usersTab;
    this.isRolesActivated = activeTab === this.rolesTab;

    this.router.navigate([], { fragment: activeTab });
  }

  get canViewUsers() {
    return this.accountService.userHasPermission(Permission.viewUsers);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRoles);
  }
}
