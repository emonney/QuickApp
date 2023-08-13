// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2023 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {

  @Input()
  placeholder = 'Search...';

  @Output()
  searchChange = new EventEmitter<string>();

  @ViewChild('searchInput')
  searchInput!: ElementRef;


  onValueChange(value: string) {
    setTimeout(() => this.searchChange.emit(value));
  }

  @HostListener('keydown.escape')
  clear() {
    this.searchInput.nativeElement.value = '';
    this.onValueChange(this.searchInput.nativeElement.value);
  }
}
