// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component, OnInit, TemplateRef, inject, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableColumn, NgxDatatableModule } from '@siemens/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { Permissions } from '../../models/permission.model';
import { UserEdit } from '../../models/user-edit.model';
import { UserInfoComponent } from './user-info.component';
import { SearchBoxComponent } from './search-box.component';

interface UserIndex extends User {
  index: number;
}

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.scss',
  imports: [SearchBoxComponent, NgxDatatableModule, UserInfoComponent, TranslateModule]
})
export class UsersManagementComponent implements OnInit {
  private alertService = inject(AlertService);
  private translationService = inject(AppTranslationService);
  private accountService = inject(AccountService);
  private modalService = inject(NgbModal);

  columns: TableColumn[] = [];
  rows: User[] = [];
  rowsCache: User[] = [];
  editedUser: UserEdit | null = null;
  sourceUser: UserEdit | null = null;
  editingUserName: { name: string } | null = null;
  loadingIndicator = false;

  allRoles: Role[] = [];

  readonly indexTemplate = viewChild.required<TemplateRef<unknown>>('indexTemplate');

  readonly userNameTemplate = viewChild.required<TemplateRef<unknown>>('userNameTemplate');

  readonly rolesTemplate = viewChild.required<TemplateRef<unknown>>('rolesTemplate');

  readonly actionsTemplate = viewChild.required<TemplateRef<unknown>>('actionsTemplate');

  readonly editorModalTemplate = viewChild.required<TemplateRef<unknown>>('editorModal');

  userEditor: UserInfoComponent | null = null;

  ngOnInit() {
    const gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      { prop: 'index', name: '#', width: 40, cellTemplate: this.indexTemplate(), canAutoResize: false },
      { prop: 'jobTitle', name: gT('users.management.Title'), width: 50 },
      { prop: 'userName', name: gT('users.management.UserName'), width: 90, cellTemplate: this.userNameTemplate() },
      { prop: 'fullName', name: gT('users.management.FullName'), width: 120 },
      { prop: 'email', name: gT('users.management.Email'), width: 140 },
      { prop: 'roles', name: gT('users.management.Roles'), width: 120, cellTemplate: this.rolesTemplate() },
      { prop: 'phoneNumber', name: gT('users.management.PhoneNumber'), width: 100 }
    ];

    if (this.canManageUsers) {
      this.columns.push({
        name: '',
        width: 160,
        cellTemplate: this.actionsTemplate(),
        resizeable: false,
        canAutoResize: false,
        sortable: false,
        draggable: false
      });
    }

    this.loadData();
  }

  setUserEditorComponent(userEditor: UserInfoComponent) {
    this.userEditor = userEditor;

    if (this.sourceUser == null)
      this.editedUser = this.userEditor.newUser(this.allRoles);
    else
      this.editedUser = this.userEditor.editUser(this.sourceUser, this.allRoles);
  }

  addNewUserToList() {
    if (this.sourceUser) {
      Object.assign(this.sourceUser, this.editedUser);

      let sourceIndex = this.rowsCache.indexOf(this.sourceUser, 0);
      if (sourceIndex > -1) {
        Utilities.moveArrayItem(this.rowsCache, sourceIndex, 0);
      }

      sourceIndex = this.rows.indexOf(this.sourceUser, 0);
      if (sourceIndex > -1) {
        Utilities.moveArrayItem(this.rows, sourceIndex, 0);
      }

      this.editedUser = null;
      this.sourceUser = null;
    } else {
      const user = new User();
      Object.assign(user, this.editedUser);
      this.editedUser = null;

      let maxIndex = 0;
      for (const u of this.rowsCache) {
        if ((u as UserIndex).index > maxIndex) {
          maxIndex = (u as UserIndex).index;
        }
      }

      (user as UserIndex).index = maxIndex + 1;

      this.rowsCache.splice(0, 0, user);
      this.rows.splice(0, 0, user);
      this.rows = [...this.rows];
    }
  }

  loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    if (this.canViewRoles) {
      this.accountService.getUsersAndRoles()
        .subscribe({
          next: results => this.onDataLoadSuccessful(results[0], results[1]),
          error: error => this.onDataLoadFailed(error)
        });
    } else {
      this.accountService.getUsers()
        .subscribe({
          next: users => this.onDataLoadSuccessful(users, this.accountService.currentUser?.roles.map(x => new Role(x)) ?? []),
          error: error => this.onDataLoadFailed(error)
        });
    }
  }

  onDataLoadSuccessful(users: User[], roles: Role[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    users.forEach((user, index) => {
      (user as UserIndex).index = index + 1;
    });

    this.rowsCache = [...users];
    this.rows = users;

    this.allRoles = roles;
  }

  onDataLoadFailed(error: HttpErrorResponse) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error',
      `Unable to retrieve users from the server.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
      MessageSeverity.error, error);
  }

  onSearchChanged(value: string) {
    this.rows = this.rowsCache.filter(r =>
      Utilities.searchArray(value, false, r.userName, r.fullName, r.email, r.phoneNumber, r.jobTitle, r.roles));
  }

  newUser() {
    this.editingUserName = null;
    this.sourceUser = null;
    this.openUserEditor();
  }

  editUser(row: UserEdit) {
    this.editingUserName = { name: row.userName };
    this.sourceUser = row;
    this.openUserEditor();
  }

  openUserEditor() {
    const modalRef = this.modalService.open(this.editorModalTemplate(), {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.shown.subscribe(() => {
      if (!this.userEditor)
        throw new Error('The user editor component was not set.');

      this.userEditor.changesSavedCallback = () => {
        this.addNewUserToList();
        modalRef.close();
      };

      this.userEditor.changesCancelledCallback = () => {
        this.editedUser = null;
        this.sourceUser = null;
        modalRef.close();
      };
    });

    modalRef.hidden.subscribe(() => {
      if (!this.userEditor)
        throw new Error('The user editor component was not set.');

      this.editingUserName = null;
      this.userEditor.resetForm(true);
      this.userEditor = null;
    });
  }

  deleteUser(row: UserEdit) {
    this.alertService.showDialog(`Are you sure you want to delete "${row.userName}"?`,
      DialogType.confirm, () => this.deleteUserHelper(row));
  }

  deleteUserHelper(row: UserEdit) {
    this.alertService.startLoadingMessage('Deleting...');
    this.loadingIndicator = true;

    this.accountService.deleteUser(row)
      .subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.rowsCache = this.rowsCache.filter(item => item !== row);
          this.rows = this.rows.filter(item => item !== row);
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.alertService.showStickyMessage('Delete Error',
            `An error occurred whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
        }
      });
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permissions.assignRoles);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permissions.viewRoles);
  }

  get canManageUsers() {
    return this.accountService.userHasPermission(Permissions.manageUsers);
  }
}
