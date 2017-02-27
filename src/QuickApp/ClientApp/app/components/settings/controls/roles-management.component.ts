// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// ======================================

import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';//Todo: Change back to 'ng2-bootstrap/modal' when valorsoft fixes umd module

import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { AccountService } from "../../../services/account.service";
import { Utilities } from "../../../services/utilities";
import { Role } from '../../../models/role.model';
import { Permission } from '../../../models/permission.model';
import { RoleEditorComponent } from "./role-editor.component";


@Component({
    selector: 'roles-management',
    templateUrl: './roles-management.component.html',
    styleUrls: ['./roles-management.component.css']
})
export class RolesManagementComponent implements OnInit, AfterViewInit {
    columns: any[] = [];
    rows: Role[] = [];
    rowsCache: Role[] = [];
    allPermissions: Permission[] = [];
    editedRole: Role;
    sourceRole: Role;
    editingRoleName: string;
    loadingIndicator: boolean;



    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('roleEditor')
    roleEditor: RoleEditorComponent;

    constructor(private alertService: AlertService, private accountService: AccountService) {
    }


    ngOnInit() {
        this.columns = [
            { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'name', name: 'Name', width: 200 },
            { prop: 'description', name: 'Description', width: 350 },
            { prop: 'usersCount', name: 'Users', width: 80 },
            { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }





    ngAfterViewInit() {

        this.roleEditor.changesSavedCallback = () => {
            this.addNewRoleToList();
            this.editorModal.hide();
        };

        this.roleEditor.changesCancelledCallback = () => {
            this.editedRole = null;
            this.sourceRole = null;
            this.editorModal.hide();
        };
    }


    addNewRoleToList() {
        if (this.sourceRole) {
            Object.assign(this.sourceRole, this.editedRole);
            this.editedRole = null;
            this.sourceRole = null;
        }
        else {
            let role = new Role();
            Object.assign(role, this.editedRole);
            this.editedRole = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>role).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, role);
            this.rows.splice(0, 0, role);
        }
    }




    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.accountService.getRolesAndPermissions()
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                let roles = results[0];
                let permissions = results[1];

                roles.forEach((role, index, roles) => {
                    (<any>role).index = index + 1;
                });


                this.rowsCache = [...roles];
                this.rows = roles;

                this.allPermissions = permissions;
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Load Error", `Unable to retrieve roles from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }


    onSearchChanged(value: string) {
        if (value) {
            value = value.toLowerCase();

            let filteredRows = this.rowsCache.filter(r => {
                let isChosen = !value
                    || r.name.toLowerCase().indexOf(value) !== -1
                    || r.description && r.description.toLowerCase().indexOf(value) !== -1;

                return isChosen;
            });

            this.rows = filteredRows;
        }
        else {
            this.rows = [...this.rowsCache];
        }
    }

    onEditorModalHidden() {
        this.editingRoleName = null;
        this.roleEditor.resetForm(true);
    }


    newRole() {
        this.editingRoleName = null;
        this.sourceRole = null;
        this.editedRole = this.roleEditor.newRole(this.allPermissions);
        this.editorModal.show();
    }


    editRole(row: Role) {
        this.editingRoleName = row.name;
        this.sourceRole = row;
        this.editedRole = this.roleEditor.editRole(row, this.allPermissions);
        this.editorModal.show();
    }

    deleteRole(row: Role) {
        this.alertService.showDialog('Are you sure you want to delete the \"' + row.name + '\" role?', DialogType.confirm, () => this.deleteRoleHelper(row));
    }


    deleteRoleHelper(row: Role) {

        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.accountService.deleteRole(row)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
            },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Delete Error", `An error occured whilst deleting the role.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }


    get canManageRoles() {
        return this.accountService.userHasPermission(Permission.manageRolesPermission)
    }

}
