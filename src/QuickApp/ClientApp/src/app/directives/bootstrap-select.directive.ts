// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2018 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Directive, Attribute, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import * as $ from 'jquery';
import 'bootstrap-select/dist/js/bootstrap-select';



@Directive({
    selector: '[bootstrapSelect]',
    exportAs: 'bootstrap-select'
})
export class BootstrapSelectDirective implements OnInit, OnDestroy {


    private changedSubscription: Subscription;
    private shownSubscription: Subscription;
    private hiddenSubscription: Subscription;

    @Input()
    required: string;

    @Input()
    set ngModel(values: string | string[]) {
        setTimeout(() => this.selected = values);
    }


    @Output()
    ngModelChange = new EventEmitter();

    @Output()
    shown = new EventEmitter();

    @Output()
    hidden = new EventEmitter();


    constructor(private el: ElementRef) {
        this.changedSubscription = Observable.fromEvent(<any>$(this.el.nativeElement), 'changed.bs.select').subscribe((e: any) => setTimeout(() => this.ngModelChange.emit(this.selected)));
        this.shownSubscription = Observable.fromEvent(<any>$(this.el.nativeElement), 'shown.bs.select').subscribe((e: any) => setTimeout(() => this.shown.emit()));
        this.hiddenSubscription = Observable.fromEvent(<any>$(this.el.nativeElement), 'hidden.bs.select').subscribe((e: any) => setTimeout(() => this.hidden.emit()));
    }



    ngOnInit() {
        (<any>$(this.el.nativeElement)).selectpicker();

        if (this.requiredAttribute)
            (<any>$(this.el.nativeElement)).selectpicker('setStyle', 'required', 'add');

        setTimeout(() => {
            this.refresh();
            this.doValidation();
        });

    }


    ngOnDestroy() {
        if (this.changedSubscription)
            this.changedSubscription.unsubscribe();

        if (this.shownSubscription)
            this.shownSubscription.unsubscribe();

        if (this.hiddenSubscription)
            this.hiddenSubscription.unsubscribe();

        (<any>$(this.el.nativeElement)).selectpicker('destroy');
    }


    private doValidation() {
        if (this.requiredAttribute) {
            (<any>$(this.el.nativeElement)).selectpicker('setStyle', !this.valid ? 'ng-valid' : 'ng-invalid', 'remove');
            (<any>$(this.el.nativeElement)).selectpicker('setStyle', this.valid ? 'ng-valid' : 'ng-invalid', 'add');
        }
    }

    private get requiredAttribute() {
        return this.required === "" || this.required == "true";
    }


    refresh() {
        setTimeout(() => {
            (<any>$(this.el.nativeElement)).selectpicker('refresh');
        });
    }

    render() {
        setTimeout(() => {
            (<any>$(this.el.nativeElement)).selectpicker('render');
        });
    }


    get valid(): boolean {
        return this.requiredAttribute ? this.selected && this.selected.length > 0 : true;
    }


    set selected(values: string | string[]) {
        (<any>$(this.el.nativeElement)).selectpicker('val', values);
        this.doValidation();
    }

    get selected(): string | string[] {
        return (<any>$(this.el.nativeElement)).selectpicker('val');
    }
}