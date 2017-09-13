// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Directive, ElementRef, Output, EventEmitter, OnDestroy, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import * as $ from 'jquery';


type eventArg = { type: string, target: Element, relatedTarget: Element };

@Directive({
    selector: '[bootstrapTab]',
    exportAs: 'bootstrap-tab'
})
export class BootstrapTabDirective implements OnDestroy {


    @Output()
    showBSTab = new EventEmitter<eventArg>();

    @Output()
    hideBSTab = new EventEmitter<eventArg>();

    private tabShownSubscription: Subscription;
    private tabHiddenSubscription: Subscription;


    constructor(private el: ElementRef, private zone: NgZone) {

        this.tabShownSubscription = Observable.fromEvent(<any>$(this.el.nativeElement), 'show.bs.tab')
            .subscribe((e: JQueryEventObject) => {
                this.runInZone(() => this.showBSTab.emit({ type: e.type, target: e.target, relatedTarget: e.relatedTarget }));
            });

        this.tabHiddenSubscription = Observable.fromEvent(<any>$(this.el.nativeElement), 'hidden.bs.tab')
            .subscribe((e: JQueryEventObject) => {
                this.runInZone(() => this.hideBSTab.emit({ type: e.type, target: e.target, relatedTarget: e.relatedTarget }));
            });
    }


    ngOnDestroy() {
        this.tabShownSubscription.unsubscribe();
        this.tabHiddenSubscription.unsubscribe();
    }


    private runInZone(delegate: () => any) {
        this.zone.run(() => {
            delegate();
        });
    }


    show(selector: string) {
        (<any>$(selector)).tab('show');
    }
}