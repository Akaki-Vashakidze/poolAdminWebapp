import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AppService} from '../../../../service/app.service';

@Component({
  selector: 'app-add-coach',
  templateUrl: './add-coach.component.html',
  styleUrls: ['./add-coach.component.scss']
})
export class AddCoachComponent implements OnInit {

  id: string = null;
  isEditable = true;
  form: UntypedFormGroup;
  groups = {
    data: [],
    baseData: [],
    selectedGroups: []
  };
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
              private _dialogRef: MatDialogRef<AddCoachComponent>,
              private _fb: UntypedFormBuilder,
              private _appService: AppService) {
    this.id = data._id;
    this.initForm();
    if (data._id) {
      this.getCoachData();
    }
  }

  ngOnInit() {
    this.getGroups();

  }

  getGroups() {
    this._appService.findGroups({}).subscribe(res => {
      this.groups.baseData = res['data'];
      this.groups.data = res['data'].map(t => {
        return {id: t._id, item: t.name, parentId: t.parentId};
      });
    });
  }

  treeAction(e) {
    switch (e.action) {
      case 'select' : {
        const groupValue = [];
        e.data.forEach(f => {
          if (f.parentId) {
            groupValue.push(this.groups.baseData.find(t => t._id === f.id));
          }
        });
        this.form.get('pool').get('groups').setValue(groupValue);
      }
        break;
    }
  }

  getCoachData() {
    this._appService.findCoachById({data: {_id: this.id}}).subscribe(res => {
      if (res['data']['isVerified']) {
        const tmp = {
          _id: res['data']['_id'],
          isVerified: res['data']['isVerified'],
          profile: res['data']['profile'],
          contact: res['data']['contact'],
          pool: res['data']['pool'],
        };
        this.form.setValue(tmp);
        this.groups.selectedGroups = this.form.get('pool').get('groups').value;
      } else {
        this.form.get('profile').get('firstName').setValue(res['data']['profile']['firstName']);
        this.form.get('profile').get('lastName').setValue(res['data']['profile']['lastName']);
      }
    });
  }

  initForm() {
    this.form = this._fb.group({
      _id: new UntypedFormControl(this.data._id),
      isVerified: true,
      profile: this._fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        birthDate: ['', Validators.required],
        pid: ['', [Validators.required, Validators.min(9999999999), Validators.max(100000000000)]],
        coverName: [''],
        coverId: [''],
        avatarName: [''],
        avatarId: [''],
        description: ['']
      }),
      contact: this._fb.group({
        address: ['', Validators.required],
        phone: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.min(100000000), Validators.max(999999999)]],
      }),
      pool: this._fb.group({
        groups: ['']
      })
    });
  }

  closeDialog(success) {
    this._dialogRef.close({success: success});
  }

  saveInfo() {
    if (!this.form.invalid) {
      let method = 'coachEdit';
      if (!this.id) {
        method = 'coachAdd';
      }
      this._appService[method]({data: this.form.value}).subscribe(res => {
        if (res['success']) {
          this._dialogRef.close({success: res['success']});
        }
      });
    }
  }

  fileChange(e, key) {
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


}
