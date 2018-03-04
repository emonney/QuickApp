// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Directive, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';

declare var $: any;

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
        this.checkedSubscription = Observable.fromEvent($(this.el.nativeElement), 'change')
            .subscribe((e: any) => this.ngModelChange.emit(e.target.checked));
    }



    ngOnInit() {
        this.initialize();
    }

    ngOnDestroy() {
        this.destroy();
    }




    initialize(options?: any) {
        $(this.el.nativeElement).bootstrapToggle(options);
    }

    destroy() {
        if (this.checkedSubscription)
            this.checkedSubscription.unsubscribe();

        $(this.el.nativeElement).bootstrapToggle('destroy');
    }

    toggleOn() {
        $(this.el.nativeElement).bootstrapToggle('on');
    }

    toggleOff() {
        $(this.el.nativeElement).bootstrapToggle('off');
    }

    toggle(value?: boolean) {
        if (value == null)
            $(this.el.nativeElement).bootstrapToggle('toggle');
        else
            $(this.el.nativeElement).prop('checked', value).change();
    }

    enable() {
        $(this.el.nativeElement).bootstrapToggle('enable');
    }

    disable() {
        $(this.el.nativeElement).bootstrapToggle('disable');
    }
}
