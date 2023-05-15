import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {AppService} from '../../../service/app.service';
import {debounceTime} from 'rxjs/operators';
import {AlertService} from '../../../service/alert.service';
import {LoadingService} from '../../../service/loading.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
  poolForm: UntypedFormGroup;
  userForm: UntypedFormGroup;
  visitAllReadyDone: boolean = false;
  maxVisit = 0;
  @Input('code') code: any;

  constructor(private _fb: UntypedFormBuilder,
              private _loadingService: LoadingService,
              private _alert: AlertService,
              private _activatedRoute: ActivatedRoute,
              private _appService: AppService) {
    this._activatedRoute.params.subscribe(params => {
      if (params.code) {
        this.code = params.code;
      }
    });
    this.initForm();
  }

  ngOnInit() {

    this.poolForm.get('code').valueChanges.pipe(
      debounceTime(300)
    ).subscribe(code => {
      if (!this.poolForm.invalid) {
        this.getUserInfo();
      }
    });
    if (this.code) {
      this.poolForm.get('code').setValue(this.code);
    }
  }

  initForm() {
    this.poolForm = this._fb.group({
      code: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    });
    this.userForm = this._fb.group({
      _id: ['', [Validators.required]],
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      visited: ['', Validators.required],
      poolActive: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  getUserInfo() {
    this._loadingService.show();
    this._appService.findUserByCode({data: this.poolForm.value}).subscribe(res => {
      if (res['success'] && res['data']) {
        const pool = res['data']['pool'];
        const visitAmount = pool['visited'] > 0 ? pool['visited']:0;
        const profile = res['data']['profile'];
        const visited = pool ? visitAmount : null;
        const poolActive = pool ? pool['active'] : null;
        this.maxVisit = pool ? pool['package']['visitAmount'] : 0;
        this.userForm.get('_id').setValue(res['data']['_id']);
        this.userForm.get('fullName').setValue(profile['firstName'] + ' ' + profile['lastName']);
        this.userForm.get('birthDate').setValue(new Date(profile['birthDate']).toLocaleDateString());
        this.userForm.get('visited').setValue(visited);
        this.userForm.get('endDate').setValue(pool.endDate);
        this.userForm.get('poolActive').setValue(poolActive);
      } else {
        this.userForm.reset();
        this._alert.callSwal('info', {text: 'ბარათი არ მოიძებნა'}, (confirm) => {
        });
      }
      this._loadingService.hide();
    }, error1 => {
      this._loadingService.hide();
    });
  }

  letsGoSwimming() {
    this._loadingService.show();
    this._appService.letsGoSwimming({data: this.poolForm.value}).subscribe(res => {
      this._loadingService.hide();
      this.getUserInfo();
      this.visitAllReadyDone = true;
      // this.closeDialog(true);
    });
  }


}
