// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Directive, Attribute, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';
import 'bootstrap-select/dist/js/bootstrap-select';



@Directive({
    selector: '[bootstrapSelect]',
    exportAs: 'bootstrap-select'
})
export class BootstrapSelectDirective implements OnInit, OnDestroy {

    @Input()
    required: string;

    @Input()
    set ngModel(values: string | string[]) {
        setTimeout(() => this.selected = values);
    }


    constructor(private el: ElementRef) {

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
        (<any>$(this.el.nativeElement)).selectpicker('refresh');
    }

    render() {
        (<any>$(this.el.nativeElement)).selectpicker('render');
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