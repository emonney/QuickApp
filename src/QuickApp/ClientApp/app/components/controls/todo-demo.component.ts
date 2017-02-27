// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// ======================================

import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';//Todo: Change back to 'ng2-bootstrap/modal' when valorsoft fixes umd module

import { AuthService } from '../../services/auth.service';
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { LocalStoreManager } from '../../services/local-store-manager.service';



@Component({
    selector: 'todo-demo',
    templateUrl: './todo-demo.component.html',
    styleUrls: ['./todo-demo.component.css']
})
export class TodoDemoComponent implements OnInit, OnDestroy {
    public static readonly DBKeyTodoDemo = "todo-demo.todo_list";

    rows = [];
    rowsCache = [];
    columns = [];
    editing = {};
    taskEdit = {};
    isDataLoaded: boolean = false;
    loadingIndicator: boolean = true;
    formResetToggle: boolean = true;
    _currentUserId: string;
    _hideCompletedTasks: boolean = false;


    get currentUserId() {
        if (this.authService.currentUser)
            this._currentUserId = this.authService.currentUser.id;

        return this._currentUserId;
    }


    set hideCompletedTasks(value: boolean) {

        if (value) {
            this.rows = this.rowsCache.filter(r => !r.completed);
        }
        else {
            this.rows = [...this.rowsCache];
        }


        this._hideCompletedTasks = value;
    }

    get hideCompletedTasks() {
        return this._hideCompletedTasks;
    }


    @Input()
    verticalScrollbar: boolean = false;


    @ViewChild('statusHeaderTemplate')
    statusHeaderTemplate: TemplateRef<any>;

    @ViewChild('statusTemplate')
    statusTemplate: TemplateRef<any>;

    @ViewChild('nameTemplate')
    nameTemplate: TemplateRef<any>;

    @ViewChild('descriptionTemplate')
    descriptionTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;


    constructor(private alertService: AlertService, private localStorage: LocalStoreManager, private authService: AuthService) {
    }



    ngOnInit() {
        this.loadingIndicator = true;

        this.fetch((data) => {
            this.rows = data;
            this.rowsCache = [...data];
            this.isDataLoaded = true;

            setTimeout(() => { this.loadingIndicator = false; }, 1500);
        });


        this.columns = [
            { prop: "completed", name: '', width: 30, headerTemplate: this.statusHeaderTemplate, cellTemplate: this.statusTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
            { prop: 'name', name: 'Task', cellTemplate: this.nameTemplate, width: 200 },
            { prop: 'description', name: 'Description', cellTemplate: this.descriptionTemplate, width: 500 },
            { name: '', width: 80, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];
    }

    ngOnDestroy() {
        this.saveToDisk();
    }



    fetch(cb) {
        let data = this.getFromDisk()

        if (data == null) {
            setTimeout(() => {

                data = this.getFromDisk();

                if (data == null) {
                    data = [
                        { "completed": true, "important": true, "name": "Create visual studio extension", "description": "Create a visual studio VSIX extension package that will add this project as an aspnet-core project template" },
                        { "completed": false, "important": true, "name": "Do a quick how-to writeup", "description": "" },
                        {
                            "completed": false, "important": false, "name": "Create aspnet-core/angular2 tutorials based on this project", "description": "Create tutorials (blog/video/youtube) on how to build applications (full stack)" +
                            " using aspnet-core/angular2. The tutorial will focus on getting productive with the technology right away rather than the details on how and why they work so audience can get onboard quickly."
                        },
                    ];
                }

                cb(data);
            }, 1000);
        }
        else {
            cb(data);
        }
    }



    onSearchChanged(value: string) {
        if (value) {
            value = value.toLowerCase();

            let filteredRows = this.rowsCache.filter(r => {
                let isChosen = !value
                    || r.name.toLowerCase().indexOf(value) !== -1
                    || r.description && r.description.toLowerCase().indexOf(value) !== -1
                    || value == 'important' && r.important
                    || value == 'not important' && !r.important;

                return isChosen;
            });

            this.rows = filteredRows;
        }
        else {
            this.rows = [...this.rowsCache];
        }
    }


    showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }


    addTask() {
        this.formResetToggle = false;

        setTimeout(() => {
            this.formResetToggle = true;

            this.taskEdit = {};
            this.editorModal.show();
        });
    }

    save() {
        this.rowsCache.splice(0, 0, this.taskEdit);
        this.rows.splice(0, 0, this.taskEdit);

        this.saveToDisk();
        this.editorModal.hide();
    }


    updateValue(event, cell, cellValue, row) {
        this.editing[row.$$index + '-' + cell] = false;
        this.rows[row.$$index][cell] = event.target.value;

        this.saveToDisk();
    }


    delete(row) {
        this.alertService.showDialog('Are you sure you want to delete the task?', DialogType.confirm, () => this.deleteHelper(row));
    }


    deleteHelper(row) {
        this.rowsCache = this.rowsCache.filter(item => item !== row)
        this.rows = this.rows.filter(item => item !== row)

        this.saveToDisk();
    }

    getFromDisk() {
        return this.localStorage.getDataObject(`${TodoDemoComponent.DBKeyTodoDemo}:${this.currentUserId}`);
    }

    saveToDisk() {
        if (this.isDataLoaded)
            this.localStorage.saveSyncedSessionData(this.rowsCache, `${TodoDemoComponent.DBKeyTodoDemo}:${this.currentUserId}`);
    }
}
