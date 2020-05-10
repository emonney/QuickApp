// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Directive, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';


declare var $: any;

@Directive({
  selector: '[appBootstrapToggle]',
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
    this.checkedSubscription = fromEvent($(this.el.nativeElement), 'change')
      .subscribe((e: any) => this.ngModelChange.emit(e.target.checked));
  }


  ngOnInit() {
    setTimeout(() => this.initialize());
  }

  ngOnDestroy() {
    this.destroy();
  }


  initialize(options?: any) {
    $(this.el.nativeElement).bootstrapToggle(options);
  }

  destroy() {
    if (this.checkedSubscription) {
      this.checkedSubscription.unsubscribe();
    }

    $(this.el.nativeElement).bootstrapToggle('destroy');
  }

  toggleOn() {
    $(this.el.nativeElement).bootstrapToggle('on');
  }

  toggleOff() {
    $(this.el.nativeElement).bootstrapToggle('off');
  }

  toggle(value?: boolean) {
    if (value == null) {
      $(this.el.nativeElement).bootstrapToggle('toggle');
    } else {
      $(this.el.nativeElement).prop('checked', value).change();
    }
  }

  enable() {
    $(this.el.nativeElement).bootstrapToggle('enable');
  }

  disable() {
    $(this.el.nativeElement).bootstrapToggle('disable');
  }
}
