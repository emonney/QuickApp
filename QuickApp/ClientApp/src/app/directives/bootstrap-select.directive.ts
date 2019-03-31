// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Directive, Attribute, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';


declare var $: any;

@Directive({
    selector: '[bootstrapSelect]',
    exportAs: 'bootstrap-select'
})
export class BootstrapSelectDirective implements OnInit, OnDestroy {

    private oldValues: string | string[] = '';

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
        this.changedSubscription = fromEvent($(this.el.nativeElement), 'changed.bs.select').subscribe((e: any) => setTimeout(() => {
            if (this.checkIsValuesChanged(this.selected)) {
                this.ngModelChange.emit(this.selected);
            }
        }));
        this.shownSubscription = fromEvent($(this.el.nativeElement), 'shown.bs.select').subscribe((e: any) => setTimeout(() => this.shown.emit()));
        this.hiddenSubscription = fromEvent($(this.el.nativeElement), 'hidden.bs.select').subscribe((e: any) => setTimeout(() => this.hidden.emit()));
    }


    ngOnInit() {
        $(this.el.nativeElement).selectpicker();

        if (this.requiredAttribute) {
            $(this.el.nativeElement).selectpicker('setStyle', 'required', 'add');
        }

        setTimeout(() => {
            this.refresh();
            this.doValidation();
        });

    }

    ngOnDestroy() {
        if (this.changedSubscription) {
            this.changedSubscription.unsubscribe();
        }

        if (this.shownSubscription) {
            this.shownSubscription.unsubscribe();
        }

        if (this.hiddenSubscription) {
            this.hiddenSubscription.unsubscribe();
        }

        $(this.el.nativeElement).selectpicker('destroy');
    }

    private checkIsValuesChanged(newValue: string | string[]) {
        return !(newValue == this.oldValues ||
            (newValue instanceof Array && newValue.length === this.oldValues.length && newValue.every((v, i) => v === this.oldValues[i])));
    }

    private doValidation() {
        if (this.requiredAttribute) {
            $(this.el.nativeElement).selectpicker('setStyle', !this.valid ? 'ng-valid' : 'ng-invalid', 'remove');
            $(this.el.nativeElement).selectpicker('setStyle', this.valid ? 'ng-valid' : 'ng-invalid', 'add');
        }
    }

    private get requiredAttribute() {
        return this.required === '' || this.required == 'true';
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

        if (!this.checkIsValuesChanged(values)) {
            return;
        }

        this.oldValues = this.selected;
        $(this.el.nativeElement).selectpicker('val', values);
        this.doValidation();
    }


    get selected(): string | string[] {
        return $(this.el.nativeElement).selectpicker('val');
    }
}
