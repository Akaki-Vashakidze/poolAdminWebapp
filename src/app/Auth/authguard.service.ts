import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../service/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // return true;
    if (!this.authService.isLoggedIn()) {
      const redirect = '/auth/login';
      this._router.navigate([redirect]);
    } else {
      return this.authService.isLoggedIn();
    }
  }
}
