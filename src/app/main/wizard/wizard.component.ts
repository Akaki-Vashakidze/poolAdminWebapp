import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AppService } from '../../service/app.service';
import { Constants } from '../../extra/constants';
import { AlertService } from '../../service/alert.service';
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  id: string = null;
  webCam = {
    show: false,
    key: null,
    value: null
  };
  isPackageEdit = false;
  qRcodeUrl = null;
  changeType = this._constants.HISTORY.CHANGE_TYPE.BUG_FIX;
  isEditable = true;
  form: UntypedFormGroup;
  groups = {
    data: []
  };
  packages = {
    data: []
  };
  coaches = {
    data: []
  };
  oldFormValue: Object;
  formIsDisabled: Boolean = true;
  file = {
    avatar: {
      accept: '.png,.img,.jpg',
      placeholder: 'აირჩიეთ ფაილი',
      disabled: false,
      value: null
    },
    cover: {
      accept: '.png,.img,.jpg',
      placeholder: 'აირჩიეთ ფაილი',
      disabled: false,
      value: null
    }
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<WizardComponent>,
    private _fb: UntypedFormBuilder,
    private _alert: AlertService,
    private _constants: Constants,
    private _appService: AppService) {
    this.qRcodeUrl = _constants.qrcodeUrl;
    this.id = data.user._id;
    this.isPackageEdit = data.isPackageEdit;
    this.initForm();
    if (data.user._id) {
      this.getUserData();
    }
  }

  ngOnInit() {

    this.getCoaches();
    this.getPackages();
    this.form.valueChanges.pipe(debounceTime(400)).subscribe(val => {
      if (JSON.stringify(val) !== JSON.stringify(this.oldFormValue)) {
        this.formIsDisabled = false;
      }
    });
    if (this.form.get('card')) {
      this.form.get('card').get('code').valueChanges.subscribe(code => {
        if (!code) {
          this.form.get('pool').disable();
        } else {
          this.form.get('pool').enable();

        }
      });
    }

    setTimeout(() => {
      console.log(this.form.value)
    }, 2000)
  }

  getGroups() {
    this._appService.findGroups({}).subscribe(res => {
      this.groups.data = res['data'].filter(t => t.parentId);
    });
  }

  getPackages() {
    this._appService.getPackages({}).subscribe(res => {
      if (res['success']) {
        this.packages.data = res['data'];
      }
    });
  }

  getGroupsByCoach() {
    const reqData = {
      data: {
        coachId: this.form.get('pool').get('coach').value
      }
    };
    this._appService.getGroupsByCoach(reqData).subscribe(res => {
      this.groups.data = res['data'].filter(t => t.parentId);
      const exists = this.groups.data.find(t => t._id === this.form.get('pool').get('group').value);
      if (!exists) {
        this.form.get('pool').get('group').setValue(null);
      }
    });
  }

  getCoaches() {
    this._appService.findCoach({ data: { recordState: this._constants.RECORD_STATE.ACTIVE } }).subscribe(res => {
      this.coaches.data = res['data'];
    });
  }
  setValues(key, data) {
    Object.keys(data).forEach(name => {
      if (this.form.get(key).get(name)) {
        this.form.get(key).get(name).setValue(data[name]);
      }
    });
  }
  getUserData() {
    this._appService.findUserById({ data: { _id: this.id } }).subscribe(res => {
      if (this.isPackageEdit) {
        if (Object.keys(res['data']['pool']).length) {
          this.setValues('pool', res['data']['pool']);
          this.setValues('card', res['data']['card']);
        }
        this.getGroupsByCoach();
      } else {
        if (res['data']['isVerified']) {
          this.setValues('profile', res['data']['profile']);
          this.setValues('contact', res['data']['contact']);
          // this.form.setValue(tmp);
        } else {
          this.form.get('profile').get('firstName').setValue(res['data']['profile']['firstName']);
          this.form.get('profile').get('lastName').setValue(res['data']['profile']['lastName']);
        }
      }
      this.oldFormValue = Object.assign({}, {}, this.form.value);
    });
  }

  initForm() {
    let formGroup = {};
    if (this.isPackageEdit) {
      formGroup = {
        _id: [this.id],
        isVerified: true,
        card: this._fb.group({
          code: ['', Validators.required],
          timestamp: ['']
        }),
        pool: this._fb.group({
          group: new UntypedFormControl(),
          coach: new UntypedFormControl(),
          package: new UntypedFormControl(),
          startDate: new UntypedFormControl(),
          endDate: new UntypedFormControl(),
          active: new UntypedFormControl(),
          visited: new UntypedFormControl(),
        })
      };
    } else {
      formGroup = {
        _id: [this.id],
        isVerified: true,
        profile: this._fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          birthDate: ['', Validators.required],
          pid: ['', [Validators.min(9999999999), Validators.max(100000000000)]],
          coverName: [''],
          coverId: [''],
          avatarName: [''],
          avatarId: ['']
        }),
        contact: this._fb.group({
          address: ['', Validators.required],
          phone: [''],
          mobile: ['', [Validators.required, Validators.min(100000000), Validators.max(999999999)]],
          responsibleName: [''],
          responsiblePhone: [''],
        })
      };
    }
    this.form = this._fb.group(formGroup);
  }

  closeDialog(success) {
    this._dialogRef.close({ success: success });
  }

  checkboxClick(e) {
    if (e.checked) {
      this.changeType = this._constants.HISTORY.CHANGE_TYPE.NEW_PACKAGE;
      const card = this.form.get('card').value;
      this.form.reset({ _id: this.id, card: card });
      this.oldFormValue = Object.assign({}, {}, this.form.value);
    } else {
      this.changeType = this._constants.HISTORY.CHANGE_TYPE.BUG_FIX;
      this.getUserData();
    }
  }

  saveInfo() {
    if (!this.form.invalid) {
      const reqData = { data: this.form.value, action: { isPackageEdit: this.isPackageEdit, changeType: this.changeType } };
      let method = 'userEdit';
      if (!this.id) {
        method = 'userAdd';
      }
      this._appService[method](reqData).subscribe(res => {
        if (res['success']) {
          this._dialogRef.close({ success: res['success'] });
        }
      });
    }
  }

  generateCode() {
    if (this.form.get('card').get('code').value) {
      this._alert.callSwal('confirm', { text: 'დარწმუნებული ხარ რომ გსურს ბარათის კოდის შეცვლა?', buttons: ['არა', 'კი'] }, (confirm) => {
        if (confirm) {
          this.form.get('card').get('code').setValue(Math.round(Math.random() * 100000000));
        }
      });
    } else {
      this.form.get('card').get('code').setValue(Math.round(Math.random() * 100000000));
    }

  }

  disablePoolForm() {
    return !this.form.get('card').get('code').value;
  }

  fileChange(e, key) {
    console.log(e);
    const data = {
      file: e,
      key: key
    };
    this._appService.uploadFile(data).subscribe(res => {
      if (res['success']) {
        this.file[key].value = e;
        this.form.get('profile').get(key + 'Name').setValue(res['data']['originalname']);
        this.form.get('profile').get(key + 'Id').setValue(res['data']['filename']);
      }

    });
  }

  takePicture(e, key) {
    this.webCam.show = e;
    this.webCam.key = key;
  }

  toggleWebCam(e) {
    this.webCam = e;
    if (this.webCam.value.imageAsDataUrl) {
      this.urltoFile(this.webCam.value.imageAsDataUrl, new Date().getTime() + '.jpeg', 'text/plain')
        .then((file) => {
          this.fileChange(file, this.webCam.key);
        });
    }
  }

  urltoFile(url, filename, mimeType) {
    return (fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      })
    );
  }
}
