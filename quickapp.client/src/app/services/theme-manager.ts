// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Injectable } from '@angular/core';

import { AppTheme } from '../models/app-theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeManager {
  themes: AppTheme[] = [
    {
      id: 1,
      name: 'Default',
      href: 'bootstrap.css',
      isDefault: true,
      background: '#007bff',
      color: '#fff'
    },
    {
      id: 2,
      name: 'Cosmo',
      href: 'cosmo.css',
      background: '#2780E3',
      color: '#373a3c'
    },
    {
      id: 3,
      name: 'Lumen',
      href: 'lumen.css',
      background: '#158CBA',
      color: '#f0f0f0'
    },
    {
      id: 4,
      name: 'Cerulean',
      href: 'cerulean.css',
      background: '#2FA4E7',
      color: '#e9ecef'
    },
    {
      id: 5,
      name: 'Minty',
      href: 'minty.css',
      background: '#78C2AD',
      color: '#F3969A'
    },
    {
      id: 6,
      name: 'Sketchy',
      href: 'sketchy.css',
      background: '#333',
      color: 'white'
    },
    {
      id: 7,
      name: 'Slate',
      href: 'slate.css',
      background: '#3A3F44',
      color: '#7A8288',
      isDark: true
    },
    {
      id: 8,
      name: 'Flatly',
      href: 'flatly.css',
      background: '#2C3E50',
      color: '#18BC9C'
    },
    {
      id: 9,
      name: 'Pulse',
      href: 'pulse.css',
      background: '#593196',
      color: '#A991D4'
    },
    {
      id: 10,
      name: 'Spacelab',
      href: 'spacelab.css',
      background: '#446E9B',
      color: '#999'
    },
    {
      id: 11,
      name: 'United',
      href: 'united.css',
      background: '#E95420',
      color: '#fff'
    },
    {
      id: 12,
      name: 'Journal',
      href: 'journal.css',
      background: '#EB6864',
      color: '#ddd'
    },
    {
      id: 13,
      name: 'Superhero',
      href: 'superhero.css',
      background: '#DF691A',
      color: '#2B3E50',
      isDark: true
    },
    {
      id: 14,
      name: 'Solar',
      href: 'solar.css',
      background: '#B58900',
      color: '#002B36',
      isDark: true
    }
  ];

  public installTheme(theme?: AppTheme) {
    if (theme == null || theme.isDefault) {
      this.removeStyle('theme');
    } else {
      this.setStyle('theme', theme.href);
    }
  }

  public getDefaultTheme(): AppTheme {
    const theme = this.themes.find(theme => theme.isDefault);

    if (!theme) {
      throw new Error('No default theme found!');
    }

    return theme;
  }

  public getThemeByID(id: number): AppTheme {
    const theme = this.themes.find(theme => theme.id === id);

    if (!theme)
      throw new Error(`Theme with id "${id}" not found!`);

    return theme;
  }

  private setStyle(key: string, href: string) {
    this.getLinkElementForKey(key).setAttribute('href', href);
  }

  private removeStyle(key: string) {
    const existingLinkElement = this.getExistingLinkElementByKey(key);
    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
  }

  private getLinkElementForKey(key: string) {
    return this.getExistingLinkElementByKey(key) || this.createLinkElementWithKey(key);
  }

  private getExistingLinkElementByKey(key: string) {
    return document.head.querySelector(`link[rel="stylesheet"].${this.getClassNameForKey(key)}`);
  }

  private createLinkElementWithKey(key: string) {
    const linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.classList.add(this.getClassNameForKey(key));
    document.head.appendChild(linkEl);
    return linkEl;
  }

  private getClassNameForKey(key: string) {
    return `style-manager-${key}`;
  }
}
