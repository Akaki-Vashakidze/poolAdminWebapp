import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: UntypedFormGroup;
  error: any;

  constructor(private _fb: UntypedFormBuilder,
              private _router: Router,
              private _authService: AuthService) {
    this.registerForm = _fb.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  register() {
    if (this.registerForm.valid) {
      this._authService.register(this.registerForm.value).subscribe(res => {
        if (res['success']) {
          this._router.navigate(['/auth/login']);
        } else {
          this.error = res['error'];
        }
      });
    }
  }


}
