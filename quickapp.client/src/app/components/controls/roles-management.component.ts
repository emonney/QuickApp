// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component, OnInit, TemplateRef, inject, viewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableColumn, NgxDatatableModule } from '@siemens/ngx-datatable';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { Role } from '../../models/role.model';
import { Permission, Permissions } from '../../models/permission.model';
import { RoleEditorComponent } from './role-editor.component';
import { SearchBoxComponent } from './search-box.component';

interface RoleIndex extends Role {
  index: number;
}

@Component({
  selector: 'app-roles-management',
  templateUrl: './roles-management.component.html',
  styleUrl: './roles-management.component.scss',
  imports: [SearchBoxComponent, NgxDatatableModule, RoleEditorComponent, TranslateModule]
})
export class RolesManagementComponent implements OnInit {
  private alertService = inject(AlertService);
  private translationService = inject(AppTranslationService);
  private accountService = inject(AccountService);
  private modalService = inject(NgbModal);

  columns: TableColumn[] = [];
  rows: Role[] = [];
  rowsCache: Role[] = [];
  allPermissions: Permission[] = [];
  editedRole: Role | null = null;
  sourceRole: Role | null = null;
  editingRoleName: { name: string } | null = null;
  loadingIndicator = false;

  readonly indexTemplate = viewChild.required<TemplateRef<unknown>>('indexTemplate');

  readonly actionsTemplate = viewChild.required<TemplateRef<unknown>>('actionsTemplate');

  readonly editorModalTemplate = viewChild.required<TemplateRef<unknown>>('editorModal');

  roleEditor: RoleEditorComponent | null = null;

  ngOnInit() {
    const gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      { prop: 'index', name: '#', width: 50, cellTemplate: this.indexTemplate(), canAutoResize: false },
      { prop: 'name', name: gT('roles.management.Name'), width: 180 },
      { prop: 'description', name: gT('roles.management.Description'), width: 320 },
      { prop: 'usersCount', name: gT('roles.management.Users'), width: 50 },
      { name: '', width: 160, cellTemplate: this.actionsTemplate(), resizeable: false, canAutoResize: false, sortable: false, draggable: false }
    ];

    this.loadData();
  }

  setRoleEditorComponent(roleEditor: RoleEditorComponent) {
    this.roleEditor = roleEditor;

    if (this.sourceRole == null)
      this.editedRole = this.roleEditor.newRole(this.allPermissions);
    else
      this.editedRole = this.roleEditor.editRole(this.sourceRole, this.allPermissions);
  }

  addNewRoleToList() {
    if (this.sourceRole) {
      Object.assign(this.sourceRole, this.editedRole);

      let sourceIndex = this.rowsCache.indexOf(this.sourceRole, 0);
      if (sourceIndex > -1) {
        Utilities.moveArrayItem(this.rowsCache, sourceIndex, 0);
      }

      sourceIndex = this.rows.indexOf(this.sourceRole, 0);
      if (sourceIndex > -1) {
        Utilities.moveArrayItem(this.rows, sourceIndex, 0);
      }

      this.editedRole = null;
      this.sourceRole = null;
    } else {
      const role = new Role();
      Object.assign(role, this.editedRole);
      this.editedRole = null;

      let maxIndex = 0;
      for (const r of this.rowsCache) {
        if ((r as RoleIndex).index > maxIndex) {
          maxIndex = (r as RoleIndex).index;
        }
      }

      (role as RoleIndex).index = maxIndex + 1;

      this.rowsCache.splice(0, 0, role);
      this.rows.splice(0, 0, role);
      this.rows = [...this.rows];
    }
  }

  loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    this.accountService.getRolesAndPermissions()
      .subscribe({
        next: results => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          const roles = results[0];
          const permissions = results[1];

          roles.forEach((role, index) => {
            (role as RoleIndex).index = index + 1;
          });

          this.rowsCache = [...roles];
          this.rows = roles;

          this.allPermissions = permissions;
        },
        error: error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.alertService.showStickyMessage('Load Error',
            `Unable to retrieve roles from the server.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
        }
      });
  }

  onSearchChanged(value: string) {
    this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.name, r.description));
  }

  newRole() {
    this.editingRoleName = null;
    this.sourceRole = null;

    this.openRoleEditor();
  }

  editRole(row: Role) {
    this.editingRoleName = { name: row.name };
    this.sourceRole = row;

    this.openRoleEditor();
  }

  openRoleEditor() {
    const modalRef = this.modalService.open(this.editorModalTemplate(), {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.shown.subscribe(() => {
      if (!this.roleEditor)
        throw new Error('The role editor component was not set.');

      this.roleEditor.changesSavedCallback = () => {
        this.addNewRoleToList();
        modalRef.close();
      };

      this.roleEditor.changesCancelledCallback = () => {
        this.editedRole = null;
        this.sourceRole = null;
        modalRef.close();
      };
    });

    modalRef.hidden.subscribe(() => {
      if (!this.roleEditor)
        throw new Error('The role editor component was not set.');

      this.editingRoleName = null;
      this.roleEditor.resetForm(true);
      this.roleEditor = null;
    });
  }

  deleteRole(row: Role) {
    this.alertService.showDialog(`Are you sure you want to delete the "${row.name}" role?`,
      DialogType.confirm, () => this.deleteRoleHelper(row));
  }

  deleteRoleHelper(row: Role) {
    this.alertService.startLoadingMessage('Deleting...');
    this.loadingIndicator = true;

    this.accountService.deleteRole(row)
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
            `An error occurred whilst deleting the role.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
        }
      });
  }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permissions.manageRoles);
  }
}
