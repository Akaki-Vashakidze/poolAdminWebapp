import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loginForm: UntypedFormGroup;
  error: any;

  constructor(private _fb: UntypedFormBuilder,
              private _router: Router,
              private _authService: AuthService) {
    this.loginForm = _fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  login() {
    if (this.loginForm.valid) {
      this._authService.logIn(this.loginForm.value).subscribe(res => {
        if (res['success']) {

          if (!res['data']['user']['isVerified']) {
            this._router.navigate(['user/profile/'  + !!res['data']['isVerified']]);
          } else {
            this._router.navigate(['/']);
          }

        } else {
          this.error = res['error'];
        }
      });
    }
  }


}
