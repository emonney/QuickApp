// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

import { Utilities } from './utilities';

@Injectable()
export class AppTitleService {
  sub: Subscription;
  appName: string;

  constructor(private titleService: Title, private router: Router) {
    this.sub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(_ => this.router.routerState.root),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }

        return route;
      }),
      mergeMap(route => route.data))
      .subscribe(data => {
        let title = data.title;

        if (title) {
          const fragment = this.router.url.split('#')[1];

          if (fragment) {
            title += ' | ' + Utilities.toTitleCase(fragment);
          }
        }

        if (title && this.appName) {
          title += ' - ' + this.appName;
        } else if (this.appName) {
          title = this.appName;
        }

        if (title) {
          this.titleService.setTitle(title);
        }
      });
  }

}
