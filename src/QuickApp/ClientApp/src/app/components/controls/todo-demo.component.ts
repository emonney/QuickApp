// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthService } from '../../services/auth.service';
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { Utilities } from "../../services/utilities";



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


    constructor(private alertService: AlertService, private translationService: AppTranslationService, private localStorage: LocalStoreManager, private authService: AuthService) {
    }



    ngOnInit() {
        this.loadingIndicator = true;

        this.fetch((data) => {
            this.refreshDataIndexes(data);
            this.rows = data;
            this.rowsCache = [...data];
            this.isDataLoaded = true;

            setTimeout(() => { this.loadingIndicator = false; }, 1500);
        });


        let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: "completed", name: '', width: 30, headerTemplate: this.statusHeaderTemplate, cellTemplate: this.statusTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
            { prop: 'name', name: gT('todoDemo.management.Task'), cellTemplate: this.nameTemplate, width: 200 },
            { prop: 'description', name: gT('todoDemo.management.Description'), cellTemplate: this.descriptionTemplate, width: 500 },
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
                            "completed": false, "important": false, "name": "Create aspnet-core/angular5 tutorials based on this project", "description": "Create tutorials (blog/video/youtube) on how to build applications (full stack)" +
                            " using aspnet-core/angular5. The tutorial will focus on getting productive with the technology right away rather than the details on how and why they work so audience can get onboard quickly."
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


    refreshDataIndexes(data) {
        let index = 0;

        for (let i of data) {
            i.$$index = index++;
        }
    }


    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.name, r.description) || value == 'important' && r.important || value == 'not important' && !r.important);
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
        this.refreshDataIndexes(this.rowsCache);
        this.rows = [...this.rows];

        this.saveToDisk();
        this.editorModal.hide();
    }


    updateValue(event, cell, cellValue, row) {
        this.editing[row.$$index + '-' + cell] = false;
        this.rows[row.$$index][cell] = event.target.value;
        this.rows = [...this.rows];

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
