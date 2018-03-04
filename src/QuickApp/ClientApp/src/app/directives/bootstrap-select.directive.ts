// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Directive, Attribute, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';

declare var $: any;

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
        this.changedSubscription = Observable.fromEvent($(this.el.nativeElement), 'changed.bs.select').subscribe((e: any) => setTimeout(() => this.ngModelChange.emit(this.selected)));
        this.shownSubscription = Observable.fromEvent($(this.el.nativeElement), 'shown.bs.select').subscribe((e: any) => setTimeout(() => this.shown.emit()));
        this.hiddenSubscription = Observable.fromEvent($(this.el.nativeElement), 'hidden.bs.select').subscribe((e: any) => setTimeout(() => this.hidden.emit()));
    }



    ngOnInit() {
        $(this.el.nativeElement).selectpicker();

        if (this.requiredAttribute)
            $(this.el.nativeElement).selectpicker('setStyle', 'required', 'add');

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

        $(this.el.nativeElement).selectpicker('destroy');
    }


    private doValidation() {
        if (this.requiredAttribute) {
            $(this.el.nativeElement).selectpicker('setStyle', !this.valid ? 'ng-valid' : 'ng-invalid', 'remove');
            $(this.el.nativeElement).selectpicker('setStyle', this.valid ? 'ng-valid' : 'ng-invalid', 'add');
        }
    }

    private get requiredAttribute() {
        return this.required === "" || this.required == "true";
    }


    refresh() {
        setTimeout(() => {
            $(this.el.nativeElement).selectpicker('refresh');
        });
    }

    render() {
        setTimeout(() => {
            $(this.el.nativeElement).selectpicker('render');
        });
    }


    get valid(): boolean {
        return this.requiredAttribute ? this.selected && this.selected.length > 0 : true;
    }


    set selected(values: string | string[]) {
        $(this.el.nativeElement).selectpicker('val', values);
        this.doValidation();
    }

    get selected(): string | string[] {
        return $(this.el.nativeElement).selectpicker('val');
    }
}
