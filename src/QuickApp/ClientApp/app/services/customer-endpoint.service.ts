// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class CustomerEndpoint extends EndpointFactory {

    private readonly _customerUrl: string = "/api/customer";

    get customerUrl() { return this.configurations.baseUrl + this._customerUrl; }


    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }


    getCustomerEndpoint<T>(customerId: string): Observable<T> {
        let endpointUrl = `${this.customerUrl}/${customerId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCustomerEndpoint(customerId));
            });
    }


    getCustomers<T>(page?: number, pageSize?: number): Observable<T> {
        let endpointUrl = page && pageSize ? `${this.customerUrl}/${page}/${pageSize}` : this.customerUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCustomers(page, pageSize));
            });
    }


    getNewCustomerEndpoint<T>(customerObject: any): Observable<T> {

        return this.http.post<T>(this.customerUrl, JSON.stringify(customerObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewCustomerEndpoint(customerObject));
            });
    }

    getUpdateUserEndpoint<T>(customerObject: any, customerId: string): Observable<T> {
        let endpointUrl = customerId ? `${this.customerUrl}/${customerId}` : null;

        return this.http.put<T>(endpointUrl, JSON.stringify(customerObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateUserEndpoint(customerObject, customerId));
            });
    }

    getPatchUpdateCustomerEndpoint<T>(patch: {}, customerId: string): Observable<T>
    getPatchUpdateCustomerEndpoint<T>(value: any, op: string, path: string, customerId: string, from?: any): Observable<T>
    getPatchUpdateCustomerEndpoint<T>(valueOrPatch: any, customerId: string, opOrCustomerId?: string, path?: string, from?: any): Observable<T> {
        let endpointUrl: string;
        let patchDocument: {};

        if (path) {
            endpointUrl = `${this.customerUrl}/${customerId}`;
            patchDocument = from ?
                [{ "value": valueOrPatch, "path": path, "op": opOrCustomerId, "from": from }] :
                [{ "value": valueOrPatch, "path": path, "op": opOrCustomerId }];
        }
        else {
          endpointUrl = `${this.customerUrl}/${opOrCustomerId}`;
            patchDocument = valueOrPatch;
        }

        return this.http.patch<T>(endpointUrl, JSON.stringify(patchDocument), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPatchUpdateCustomerEndpoint(valueOrPatch, opOrCustomerId, path, from, customerId));
            });
    }

    getDeleteCustomerEndpoint<T>(userId: string): Observable<T> {
        let endpointUrl = `${this.customerUrl}/${userId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteCustomerEndpoint(userId));
            });
    }  
}