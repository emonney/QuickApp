// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component, ElementRef, HostListener, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
  imports: [FormsModule]
})
export class SearchBoxComponent {
  readonly placeholder = input('Search...');

  readonly searchChange = output<string>();

  readonly searchInput = viewChild.required<ElementRef>('searchInput');

  onValueChange(value: string) {
    setTimeout(() => this.searchChange.emit(value));
  }

  @HostListener('keydown.escape')
  clear() {
    const searchInput = this.searchInput();

    searchInput.nativeElement.value = '';
    this.onValueChange(searchInput.nativeElement.value);
  }
}
