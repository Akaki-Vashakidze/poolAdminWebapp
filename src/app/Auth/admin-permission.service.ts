import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Constants} from '../extra/constants';

@Injectable()
export class AdminPermissionService implements CanActivate {
  sessionData = JSON.parse(localStorage.getItem('sessionData'));

  constructor(private _router: Router, private constants: Constants) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.sessionData.userGroupId === this.constants.adminUserGroupId) {
      return true;
    } else {
      this._router.navigate(['user']);
    }
  }
}
