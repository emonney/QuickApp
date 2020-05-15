// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Directive, ElementRef, Output, EventEmitter, OnDestroy, NgZone } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';


declare var $: any;

interface EventArg { type: string; target: Element; relatedTarget: Element; }

@Directive({
  selector: '[appBootstrapTab]',
  exportAs: 'bootstrap-tab'
})
export class BootstrapTabDirective implements OnDestroy {


  @Output()
  showBSTab = new EventEmitter<EventArg>();

  @Output()
  hideBSTab = new EventEmitter<EventArg>();

  private tabShownSubscription: Subscription;
  private tabHiddenSubscription: Subscription;


  constructor(private el: ElementRef, private zone: NgZone) {

    this.tabShownSubscription = fromEvent($(this.el.nativeElement), 'show.bs.tab')
      .subscribe((e: any) => {
        this.runInZone(() => this.showBSTab.emit({ type: e.type, target: e.target, relatedTarget: e.relatedTarget }));
      });

    this.tabHiddenSubscription = fromEvent($(this.el.nativeElement), 'hidden.bs.tab')
      .subscribe((e: any) => {
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
    $(selector).tab('show');
  }
}
