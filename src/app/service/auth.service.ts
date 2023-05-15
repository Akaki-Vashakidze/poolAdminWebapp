import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AlertService} from './alert.service';

@Injectable()
export class AuthService {
  constructor(private  _http: HttpClient, private _router: Router, private _alert: AlertService) {

  }

  errorHandler(res) {
    if (!res['success'] && res['error']) {
      this._alert.callSwal('error', {text: res['error']['error']});
    }
  }

  httpErrorHandler(res) {
    if (res['status'] === 401) {
      this._alert.callSwal('error', {text: res['error']['error']['error']}, () => {
        localStorage.removeItem('sessionData');
        this._router.navigate(['/auth/login']);
      });
    }
  }

  isLoggedIn() {
    return !!(JSON.parse(localStorage.getItem('sessionData')));
  }

  retrieveSession() {
    return this._http.post('/pool/auth/retrieve/session', {}).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  logIn(user: any) {
    return this._http.post('/pool/auth/login', {data: user}).pipe(tap(res => {
      if (res['success']) {
        localStorage.setItem('sessionData', JSON.stringify(res['data']['user']));
      } else {
        this.errorHandler(res);
      }
    }, error => this.httpErrorHandler(error)));
  }

  register(user: any) {
    return this._http.post('/pool/auth/register', {data: user}).pipe(tap(res => {
      if (res['success']) {
        this._alert.callSwal('info', {text: 'რეგისტრაცია წარმატებით დასრულდა'});
      } else {
        this.errorHandler(res);
      }
    }, error => this.httpErrorHandler(error)));
  }

  logOut() {
    return this._http.post('/pool/auth/logout', {}).pipe(tap(res => {
      if (res['success']) {
        localStorage.removeItem('sessionData');
        location.href = '/';
      }
    }));
  }
}
