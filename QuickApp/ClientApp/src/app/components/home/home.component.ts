// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { AuthService } from '../../services/auth.service';

interface WidgetIndex { element: string, index: number }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInOut]
})
export class HomeComponent implements AfterViewInit {
  dragStartDelay = 200;
  readonly DBKeyWidgetsOrder = 'home-component.widgets_order';

  @ViewChild('widgetsContainer', { read: ElementRef })
  widgetsContainer: ElementRef<HTMLDivElement>

  constructor(private authService: AuthService, public configurations: ConfigurationService) {

  }

  ngAfterViewInit(): void {
    this.restoreWidgetsOrder();
  }

  restoreWidgetsOrder() {
    const widgetIndexes = this.loadWidgetIndexes();

    if (widgetIndexes == null || widgetIndexes.length == 0)
      return;

    const parentEle = this.widgetsContainer.nativeElement;

    for (var i = 0; i < parentEle.children.length; i++) {
      const widget = parentEle.children[i];
      const index = widgetIndexes.find(w => w.element == widget.id)?.index;

      if (index != null)
        this.insertChildAtIndex(parentEle, widget, index);
    }
  }

  insertChildAtIndex(parent: HTMLDivElement, child: Element, index: number) {
    if (!index)
      index = 0

    if (index >= parent.children.length) {
      parent.appendChild(child)
    } else {
      parent.insertBefore(child, parent.children[index])
    }
  }

  drop(event: CdkDragDrop<HTMLDivElement>) {
    const el = event.item.element.nativeElement;
    const parentEle = event.container.element.nativeElement;
    const anchorEle = parentEle.children[event.currentIndex];

    const widgetIndexes = new Array<WidgetIndex>(parentEle.children.length);

    for (var i = 0; i < parentEle.children.length; i++) {
      widgetIndexes[i] = { element: parentEle.children[i].id, index: i };
    }

    moveItemInArray(widgetIndexes, event.previousIndex, event.currentIndex)

    for (var i = 0; i < widgetIndexes.length; i++) {
      widgetIndexes[i].index = i;
    }

    if (event.currentIndex < event.previousIndex)
      parentEle.insertBefore(el, anchorEle);
    else
      parentEle.insertBefore(el, anchorEle.nextElementSibling);

    this.saveWidgetIndexes(widgetIndexes);
  }


  saveWidgetIndexes(indexes: WidgetIndex[]) {
    this.configurations
      .saveConfiguration(indexes, `${this.DBKeyWidgetsOrder}:${this.authService.currentUser?.id}`);
  }

  loadWidgetIndexes() {
    return this.configurations
      .getConfiguration<WidgetIndex[]>(`${this.DBKeyWidgetsOrder}:${this.authService.currentUser?.id}`);
  }

}
