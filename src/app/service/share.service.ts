import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private _userData: BehaviorSubject<any> = new BehaviorSubject(null);

  readonly user: Observable<any> = this._userData.asObservable();

  constructor() { }


  setUser(user: any){
    console.log(user);
    this._userData.next(user);
  }


  getUser() {
    return this.user;
  }
}
