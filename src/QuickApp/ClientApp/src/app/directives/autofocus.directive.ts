// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Directive, ElementRef, OnInit } from '@angular/core';


@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements OnInit {
  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
    setTimeout(() => this.elementRef.nativeElement['focus'](), 500);
  }
}
