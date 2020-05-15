// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, from, throwError } from 'rxjs';
import { mergeMap, switchMap, catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class EndpointBase {

  private taskPauser: Subject<any>;
  private isRefreshingLogin: boolean;

  constructor(
    protected http: HttpClient,
    private authService: AuthService) {

  }

  protected get requestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.accessToken,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*'
    });

    return { headers };
  }

  public refreshLogin() {
    return this.authService.refreshLogin().pipe(
      catchError(error => {
        return this.handleError(error, () => this.refreshLogin());
      }));
  }

  protected handleError(error, continuation: () => Observable<any>) {
    if (error.status === 401) {
      if (this.isRefreshingLogin) {
        return this.pauseTask(continuation);
      }

      this.isRefreshingLogin = true;

      return from(this.authService.refreshLogin()).pipe(
        mergeMap(() => {
          this.isRefreshingLogin = false;
          this.resumeTasks(true);

          return continuation();
        }),
        catchError(refreshLoginError => {
          this.isRefreshingLogin = false;
          this.resumeTasks(false);
          this.authService.reLogin();

          if (refreshLoginError.status === 401 || (refreshLoginError.error && refreshLoginError.error.error === 'invalid_grant')) {
            return throwError('session expired');
          } else {
            return throwError(refreshLoginError || 'server error');
          }
        }));
    }

    if (error.error && error.error.error === 'invalid_grant') {
      this.authService.reLogin();

      return throwError((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
    } else {
      return throwError(error);
    }
  }



  private pauseTask(continuation: () => Observable<any>) {
    if (!this.taskPauser) {
      this.taskPauser = new Subject();
    }

    return this.taskPauser.pipe(switchMap(continueOp => {
      return continueOp ? continuation() : throwError('session expired');
    }));
  }


  private resumeTasks(continueOp: boolean) {
    setTimeout(() => {
      if (this.taskPauser) {
        this.taskPauser.next(continueOp);
        this.taskPauser.complete();
        this.taskPauser = null;
      }
    });
  }
}
