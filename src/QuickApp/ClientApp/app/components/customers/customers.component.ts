import { Component, ViewChild, TemplateRef } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { AccountService } from "../../services/account.service";

import { Utilities } from "../../services/utilities";
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Permission } from '../../models/permission.model';

@Component({
    selector: 'customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.css'],
    animations: [fadeInOut]
})
export class CustomersComponent {

  customers: Customer[];

  columns: any[] = [];
  rows: Customer[] = [];
  rowsCache: Customer[] = [];
  loadingIndicator: boolean;

  @ViewChild('indexTemplate')
  indexTemplate: TemplateRef<any>;

  @ViewChild('customerNameTemplate')
  customerNameTemplate: TemplateRef<any>;

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private customerService: CustomerService,
    private accountService: AccountService) { }

  ngOnInit() {
    var promise = this.customerService.getCustomers().do(customers => this.customers = customers);
    let gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
      { prop: 'name', name: gT('cust.mgmt.Name'), width: 120 },
      { prop: 'serviceExpireDate', name: gT('cust.mgmt.ExpDate'), width: 90, cellTemplate: this.customerNameTemplate },
      { prop: 'serviceMaxUsers', name: gT('cust.mgmt.MaxUsers'), width: 50 },
      { prop: 'serviceMaxStorageMegabytes', name: gT('cust.mgmt.maxMbytes'), width: 140 },
      { prop: 'primaryContactEmail', name: gT('cust.mgmt.primary_email'), width: 140 },
      { prop: 'primaryContactName', name: gT('cust.mgmt.primary_name'), width: 140 },
      { prop: 'primaryContactPhoneNumber', name: gT('cust.mgmt.primary_phone'), width: 140 },
    ];

    this.loadData();
  }


  loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    this.customerService.getCustomers().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
  }


  onDataLoadSuccessful(customers: Customer[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    customers.forEach((customer, index, customers) => {
      (<any>customer).index = index + 1;
    });

    this.rowsCache = [...customers];
    this.rows = customers;
  }

  onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage(
      "Load Error",
      `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
      MessageSeverity.error, error);
  }

  get canViewCustomers() {
    return this.accountService.userHasPermission(Permission.viewCustomersPermission);
  }

  get canManageCustomers() {
    return this.accountService.userHasPermission(Permission.manageCustomersPermission);
  }

}
