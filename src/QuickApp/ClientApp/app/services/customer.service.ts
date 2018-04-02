import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { CustomerEndpoint } from './customer-endpoint.service';
import { AuthService } from './auth.service';
import { Customer } from '../models/customer.model';
import { CustomerEdit } from '../models/user-edit.model';


@Injectable()
export class CustomerService {

  constructor(private router: Router, private http: HttpClient, private authService: AuthService,
    private customerEndpoint: CustomerEndpoint) {

  }

  getCustomer(customerId?: string) {
    return this.customerEndpoint.getCustomerEndpoint<Customer>(customerId);
  }

  getCustomers(page?: number, pageSize?: number) {

    return this.customerEndpoint.getCustomers<Customer[]>(page, pageSize);
  }

  newUser(customer: CustomerEdit) {
    return this.customerEndpoint.getNewCustomerEndpoint<Customer>(customer);
  }

  deleteCustomer(customerOrCustomerId: string | CustomerEdit): Observable<Customer> {

    if (typeof customerOrCustomerId === 'string' || customerOrCustomerId instanceof String) {
      return this.customerEndpoint.getDeleteCustomerEndpoint<Customer>(<string>customerOrCustomerId);
    }
    else {

      if (customerOrCustomerId.id) {
        return this.deleteCustomer(customerOrCustomerId.id);
      }
      else {
        ;
      }
    }
  }
}