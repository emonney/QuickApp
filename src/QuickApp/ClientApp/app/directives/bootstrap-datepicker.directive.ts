// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Directive, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';

import * as $ from 'jquery';
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker';



@Directive({
    selector: '[bootstrapDatepicker]',
    exportAs: 'bootstrap-datepicker'
})
export class BootstrapDatepickerDirective implements OnInit, OnDestroy {

    private _isShown = false;
    private updateTimeout;
    private changedSubscription: Subscription;
    private shownSubscription: Subscription;
    private hiddenSubscription: Subscription;

    get isShown() {
        return this._isShown;
    }

    @Input()
    options = {};

    @Input()
    set ngModel(value) {
        this.tryUpdate(value);
    }


    @Output()
    ngModelChange = new EventEmitter();


    constructor(private el: ElementRef) {
        this.changedSubscription = Observable.fromEvent(<any>$(this.el.nativeElement), 'change').subscribe((e: any) => setTimeout(() => this.ngModelChange.emit(e.target.value)));
        this.shownSubscription = Observable.fromEvent(<any>$(this.el.nativeElement), 'show').subscribe((e: any) => this._isShown = true);
        this.hiddenSubscription = Observable.fromEvent(<any>$(this.el.nativeElement), 'hide').subscribe((e: any) => this._isShown = false);
    }



    ngOnInit() {
        this.initialize(this.options);
    }

    ngOnDestroy() {
        this.destroy();
    }




    initialize(options?: any) {
        (<any>$(this.el.nativeElement)).datepicker(options);
    }

    destroy() {
        if (this.changedSubscription) {
            this.changedSubscription.unsubscribe();
            this.shownSubscription.unsubscribe();
            this.hiddenSubscription.unsubscribe();
        }

        (<any>$(this.el.nativeElement)).datepicker('destroy');
    }



    show() {
        (<any>$(this.el.nativeElement)).datepicker('show');
    }


    hide() {
        (<any>$(this.el.nativeElement)).datepicker('hide');
    }


    toggle() {
        this.isShown ? this.hide() : this.show();
    }


    private tryUpdate(value) {

        clearTimeout(this.updateTimeout);

        if (!$(this.el.nativeElement).is(":focus")) {
            this.update(value);
        } else {
            this.updateTimeout = setTimeout(() => {
                this.updateTimeout = null;
                this.tryUpdate(value);
            }, 100);
        }
    }

    update(value) {
        setTimeout(() => (<any>$(this.el.nativeElement)).datepicker('update', value));
    }


    setDate(value) {
        setTimeout(() => (<any>$(this.el.nativeElement)).datepicker('setDate', value));
    }


    setUTCDate(value) {
        setTimeout(() => (<any>$(this.el.nativeElement)).datepicker('setUTCDate', value));
    }


    clearDates() {
        setTimeout(() => (<any>$(this.el.nativeElement)).datepicker('clearDates'));
    }


    getDate() {
        (<any>$(this.el.nativeElement)).datepicker('getDate');
    }


    getUTCDate() {
        (<any>$(this.el.nativeElement)).datepicker('getUTCDate');
    }
}