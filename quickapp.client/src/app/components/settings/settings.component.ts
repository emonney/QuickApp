// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component, inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { fadeInOut } from '../../services/animations';
import { AccountService } from '../../services/account.service';
import { Permissions } from '../../models/permission.model';
import { UserInfoComponent } from '../controls/user-info.component';
import { UserPreferencesComponent } from '../controls/user-preferences.component';
import { UsersManagementComponent } from '../controls/users-management.component';
import { RolesManagementComponent } from '../controls/roles-management.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    animations: [fadeInOut],
    imports: [
        RouterLink, TranslateModule, NgbNavModule,
        UserInfoComponent, UserPreferencesComponent, UsersManagementComponent, RolesManagementComponent
    ]
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  public route = inject(ActivatedRoute);
  private accountService = inject(AccountService);

  readonly profileTab = 'profile';
  readonly preferencesTab = 'preferences';
  readonly usersTab = 'users';
  readonly rolesTab = 'roles';
  activeTab = '';
  showDatatable = false; // Delays showing the table until tab is shown so column widths are calculated correctly
  fragmentSubscription: Subscription | undefined;

  ngOnInit() {
    this.fragmentSubscription = this.route.fragment.subscribe(fragment => this.setActiveTab(fragment));
  }

  ngAfterViewInit() {
    setTimeout(() => this.showDatatable = true);
  }

  ngOnDestroy() {
    this.fragmentSubscription?.unsubscribe();
  }

  setActiveTab(fragment: string | null) {
    fragment = fragment?.toLowerCase() ?? this.profileTab;

    const canViewTab = fragment === this.profileTab || fragment === this.preferencesTab ||
      (fragment === this.usersTab && this.canViewUsers) || (fragment === this.rolesTab && this.canViewRoles);

    if (canViewTab)
      this.activeTab = fragment;
    else
      this.router.navigate([], { fragment: this.profileTab });
  }

  get canViewUsers() {
    return this.accountService.userHasPermission(Permissions.viewUsers);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permissions.viewRoles);
  }
}
