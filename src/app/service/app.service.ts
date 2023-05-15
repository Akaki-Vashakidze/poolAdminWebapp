import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AlertService} from './alert.service';
import {AuthService} from './auth.service';
import { ShareService } from './share.service';

@Injectable()
export class AppService {
  sessionData;

  constructor(private  _http: HttpClient, private _router: Router, private _alert: AlertService, private _authService: AuthService, private _share:ShareService) {
    this._authService.retrieveSession().subscribe(res => {
      this.sessionData = res;
      this._share.setUser(res['data']['user'])
    });
  }

  errorHandler(res) {
    if (!res['success'] && res['error']) {
      this._alert.callSwal('error', {text: res['error']['error'] || res['error']['errmsg']});
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

  findUser(data) {
    return this._http.post('/pool/user/find', data, {observe: 'response'}).pipe(tap(res => this.errorHandler(res['body']), error => this.httpErrorHandler(error)), map(res => {
      return res['body'];
    }));
  }

  findUserById(data) {
    return this._http.post('/pool/user/findById', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }
  findUserByCode(data) {
    return this._http.post('/pool/user/findByCode', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }
  letsGoSwimming(data) {
    return this._http.post('/pool/user/letsGoSwimming', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }
  findUserByIdWithPopulation(data) {
    return this._http.post('/pool/user/findById/population', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  userEdit(data) {
    return this._http.post('/pool/user/edit', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  userAdd(data) {
    return this._http.post('/pool/user/add', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  findCoach(data) {
    return this._http.post('/pool/coach/find', data, {observe: 'response'}).pipe(tap(res => this.errorHandler(res['body']), error => this.httpErrorHandler(error)), map(res => {
      return res['body'];
    }));
  }

  findCoachById(data) {
    return this._http.post('/pool/coach/findById', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  coachEdit(data) {
    return this._http.post('/pool/coach/edit', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  coachAdd(data) {
    return this._http.post('/pool/coach/add', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  deleteGroup(data) {
    return this._http.post('/pool/group/delete', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  insertGroup(data) {
    return this._http.post('/pool/group/add', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  findGroups(data) {
    return this._http.post('/pool/group/find', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  getGroupsByCoach(data) {
    return this._http.post('/pool/group/findByCoach', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  addPackage(data) {
    return this._http.post('/pool/package/add', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  editPackage(data) {
    return this._http.post('/pool/package/edit', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }
  getPackages(data) {
    return this._http.post('/pool/package/findAll', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  findPackage(data) {
    return this._http.post('/pool/package/find', data, {observe: 'response'}).pipe(tap(res => this.errorHandler(res['body']), error => this.httpErrorHandler(error)), map(res => {
      return res['body'];
    }));
  }
  getHistoryUser(data) {
    return this._http.post('/pool/history/find/user', data, {observe: 'response'}).pipe(tap(res => this.errorHandler(res['body']), error => this.httpErrorHandler(error)), map(res => {
      return res['body'];
    }));
  }
  getHistoryVisit(data) {
    return this._http.post('/pool/history/find/user', data, {observe: 'response'}).pipe(tap(res => this.errorHandler(res['body']), error => this.httpErrorHandler(error)), map(res => {
      return res['body'];
    }));
  }
  getHistoryPool(data) {
    return this._http.post('/pool/history/find/pool', data, {observe: 'response'}).pipe(tap(res => this.errorHandler(res['body']), error => this.httpErrorHandler(error)), map(res => {
      return res['body'];
    }));
  }

  findEvents(data) {
    return this._http.post('/pool/event/find', data, {observe: 'response'}).pipe(tap(res => this.errorHandler(res['body']), error => this.httpErrorHandler(error)), map(res => {
      return res['body'];
    }));
  }
  eventEdit(data) {
    return this._http.post('/pool/event/edit', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }
  eventAdd(data) {
    return this._http.post('/pool/event/add', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }
  findEventById(data) {
    return this._http.post('/pool/event/findById', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }

  addRace(data) {
    return this._http.post('/pool/race/addMany', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }
  findRace(data) {
    return this._http.post('/pool/race/find', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }
  raceEdit(data) {
    return this._http.post('/pool/race/edit', data).pipe(tap(res => this.errorHandler(res), error => this.httpErrorHandler(error)));
  }
  uploadFile(data) {
    const formData = new FormData();
    formData.append('file', data.file);
    return this._http.post('/pool/file/upload', formData);
  }
}
