// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-search-box',
    templateUrl: './search-box.component.html',
    styleUrl: './search-box.component.scss',
    standalone: true,
    imports: [FormsModule]
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
