// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Injectable } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';

import { LocalStoreManager } from '../services/local-store-manager.service';

@Injectable()
export class AuthStorage implements OAuthStorage {

  constructor(private localStorage: LocalStoreManager) {
  }

  static RememberMe = false;
  private dbKeyPrefix = 'AUTH:';

  getItem(key: string): string {
    return this.localStorage.getData(this.dbKeyPrefix + key);
  }

  removeItem(key: string): void {
    this.localStorage.deleteData(this.dbKeyPrefix + key);
  }

  setItem(key: string, data: string): void {
    if (AuthStorage.RememberMe) {
      this.localStorage.savePermanentData(data, this.dbKeyPrefix + key);
    } else {
      this.localStorage.saveSyncedSessionData(data, this.dbKeyPrefix + key);
    }
  }
}
