// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Injectable, inject } from '@angular/core';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Utilities } from './utilities';

@Injectable()
export class AppTitleService extends TitleStrategy {
  private readonly titleService = inject(Title);

  static appName: string | undefined;

  override updateTitle(routerState: RouterStateSnapshot) {
    let title = this.buildTitle(routerState);

    if (title) {
      const fragment = routerState.url.split('#')[1];

      if (fragment) {
        title += ` | ${Utilities.toTitleCase(fragment)}`;
      }

      if (AppTitleService.appName) {
        title += ` - ${AppTitleService.appName}`;
      }

      this.titleService.setTitle(title);

    } else if (AppTitleService.appName) {
      this.titleService.setTitle(AppTitleService.appName);
    }
  }
}
