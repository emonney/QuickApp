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
import 'bootstrap-toggle/js/bootstrap-toggle';



@Directive({
    selector: '[bootstrapToggle]',
    exportAs: 'bootstrap-toggle'
})
export class BootstrapToggleDirective implements OnInit, OnDestroy {

    private checkedSubscription: Subscription;

    @Input()
    set ngModel(value) {
        this.toggle(value);
    }

    @Output()
    ngModelChange = new EventEmitter();


    constructor(private el: ElementRef) {
        this.checkedSubscription = Observable.fromEvent(<any>$(this.el.nativeElement), 'change')
            .subscribe((e: any) => this.ngModelChange.emit(e.target.checked));
    }



    ngOnInit() {
        this.initialize();
    }

    ngOnDestroy() {
        this.destroy();
    }




    initialize(options?: any) {
        (<any>$(this.el.nativeElement)).bootstrapToggle(options);
    }

    destroy() {
        if (this.checkedSubscription)
            this.checkedSubscription.unsubscribe();

        (<any>$(this.el.nativeElement)).bootstrapToggle('destroy');
    }

    toggleOn() {
        (<any>$(this.el.nativeElement)).bootstrapToggle('on');
    }

    toggleOff() {
        (<any>$(this.el.nativeElement)).bootstrapToggle('off');
    }

    toggle(value?: boolean) {
        if (value == null)
            (<any>$(this.el.nativeElement)).bootstrapToggle('toggle');
        else
            $(this.el.nativeElement).prop('checked', value).change();
    }

    enable() {
        (<any>$(this.el.nativeElement)).bootstrapToggle('enable');
    }

    disable() {
        (<any>$(this.el.nativeElement)).bootstrapToggle('disable');
    }
}