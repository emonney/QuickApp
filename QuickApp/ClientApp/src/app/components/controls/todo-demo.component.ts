// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableColumn } from '@swimlane/ngx-datatable';

import { AuthService } from '../../services/auth.service';
import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { Utilities } from '../../services/utilities';


interface Todo {
  $$index?: number;
  completed: boolean;
  important: boolean
  name: string;
  description: string
}


@Component({
  selector: 'app-todo-demo',
  templateUrl: './todo-demo.component.html',
  styleUrls: ['./todo-demo.component.scss']
})
export class TodoDemoComponent implements OnInit, OnDestroy {
  public static readonly DBKeyTodoDemo = 'todo-demo.todo_list';

  columns: TableColumn[] = [];
  rows: Todo[] = [];
  rowsCache: Todo[] = [];
  editing: { [key: string]: boolean } = {};
  taskEdit: Partial<Todo> = {};
  isDataLoaded = false;
  loadingIndicator = true;
  formResetToggle = true;
  private _currentUserId: string | undefined;
  private _hideCompletedTasks = false;

  get currentUserId() {
    if (this.authService.currentUser) {
      this._currentUserId = this.authService.currentUser.id;
    }

    return this._currentUserId;
  }

  set hideCompletedTasks(value: boolean) {
    if (value) {
      this.rows = this.rowsCache.filter(r => !r.completed);
    } else {
      this.rows = [...this.rowsCache];
    }

    this._hideCompletedTasks = value;
  }
  get hideCompletedTasks() {
    return this._hideCompletedTasks;
  }


  @Input()
  verticalScrollbar = false;

  @ViewChild('statusHeaderTemplate', { static: true })
  statusHeaderTemplate!: TemplateRef<unknown>;

  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<unknown>;

  @ViewChild('nameTemplate', { static: true })
  nameTemplate!: TemplateRef<unknown>;

  @ViewChild('descriptionTemplate', { static: true })
  descriptionTemplate!: TemplateRef<unknown>;

  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate!: TemplateRef<unknown>;

  @ViewChild('editorModal', { static: true })
  editorModalTemplate!: TemplateRef<unknown>;


  constructor(private alertService: AlertService, private translationService: AppTranslationService,
    private localStorage: LocalStoreManager, private authService: AuthService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.loadingIndicator = true;

    this.fetch(data => {
      this.refreshDataIndexes(data);
      this.rows = data;
      this.rowsCache = [...data];
      this.isDataLoaded = true;

      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });

    const gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      { prop: 'completed', name: '', width: 30, headerTemplate: this.statusHeaderTemplate, cellTemplate: this.statusTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
      { prop: 'name', name: gT('todoDemo.management.Task'), cellTemplate: this.nameTemplate, width: 100 },
      { prop: 'description', name: gT('todoDemo.management.Description'), cellTemplate: this.descriptionTemplate, width: 300 },
      { name: '', width: 80, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
    ];
  }

  ngOnDestroy() {
    this.saveToDisk();
  }

  fetch(callback: (data: Todo[]) => void) {
    let data = this.getFromDisk();

    if (data == null) {
      setTimeout(() => {
        data = this.getFromDisk();

        if (data == null) {
          data = [
            {
              completed: true,
              important: true,
              name: 'Create visual studio extension',
              description: 'Create a visual studio VSIX extension package that will add this project as an aspnet-core project template'
            },
            {
              completed: false,
              important: true,
              name: 'Do a quick how-to writeup',
              description: ''
            },
            {
              completed: false,
              important: false,
              name: 'Create aspnet-core/Angular tutorials based on this project',
              description: 'Create tutorials (blog/video/youtube) on how to build applications (full stack)' +
                ' using aspnet-core/Angular. The tutorial will focus on getting productive with the technology right away rather than the details on how and why they work so audience can get onboard quickly.'
            },
          ];
        }

        callback(data);
      }, 1000);
    } else {
      callback(data);
    }
  }

  refreshDataIndexes(data: Todo[]) {
    let index = 0;

    for (const i of data) {
      i.$$index = index++;
    }
  }

  onSearchChanged(value: string) {
    this.rows = this.rowsCache.filter(r =>
      Utilities.searchArray(value, false, r.name, r.description) ||
      value === 'important' && r.important ||
      value === 'not important' && !r.important);
  }

  showErrorAlert(caption: string, message: string) {
    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }

  addTask() {
    this.formResetToggle = false;

    setTimeout(() => {
      this.formResetToggle = true;

      this.taskEdit = {};
      this.modalService.open(this.editorModalTemplate);
    });
  }

  save() {
    this.rowsCache.splice(0, 0, this.taskEdit as Todo);
    this.rows.splice(0, 0, this.taskEdit as Todo);
    this.refreshDataIndexes(this.rowsCache);
    this.rows = [...this.rows];

    this.saveToDisk();
    return true;
  }

  updateValue(event: Event, cell: 'name' | 'description', cellValue: string, row: Todo) {
    this.editing[row.$$index + '-' + cell] = false;
    this.rows[row.$$index as number][cell] = (event.target as HTMLInputElement).value;
    this.rows = [...this.rows];

    this.saveToDisk();
  }

  delete(row: Todo) {
    this.alertService.showDialog('Are you sure you want to delete the task?', DialogType.confirm, () => this.deleteHelper(row));
  }

  deleteHelper(row: Todo) {
    this.rowsCache = this.rowsCache.filter(item => item !== row);
    this.rows = this.rows.filter(item => item !== row);

    this.saveToDisk();
  }

  getFromDisk() {
    return this.localStorage.getDataObject<Todo[]>(`${TodoDemoComponent.DBKeyTodoDemo}:${this.currentUserId}`);
  }

  saveToDisk() {
    if (this.isDataLoaded) {
      this.localStorage.saveSyncedSessionData(this.rowsCache, `${TodoDemoComponent.DBKeyTodoDemo}:${this.currentUserId}`);
    }
  }
}
