import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AppService} from '../../../service/app.service';
import {AlertService} from '../../../service/alert.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { LoadingService } from 'src/app/service/loading.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
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
  styles = [
    'Freestyle',
    'Backstroke',
    'BreastStroke',
    'Butterfly',
    'Individual Medley'
  ];
  genders = [
    'Men',
    'Women'
  ];
  distances = [
    50, 100, 200, 400, 800, 1500
  ];
  items: UntypedFormArray;
  showParticipantFor = {};
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _dialogRef: MatDialogRef<AddEventComponent>,
              private _fb: UntypedFormBuilder,
              private _alertService: AlertService,
              private _loadingService:LoadingService,
              private _appService: AppService) {
    this.id = data._id;
    this.initForm();
    if (data._id) {
      this.getEventData();
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


  getEventData() {
    this._loadingService.show();
    this._appService.findEventById({data: {_id: this.id}}).subscribe(res => {
      const tmp = {
        _id: res['data']['_id'],
        name: res['data']['name'],
        description: res['data']['description'],
        coverName: res['data']['coverName'],
        coverId: res['data']['coverId'],
        startDate: res['data']['startDate'],
        endDate: res['data']['endDate']
      };
      this.form.get('base').setValue(tmp);
      this.findRaces();
      this._loadingService.hide();
    });
  }

  initForm() {
    this.form = this._fb.group({
      base: new UntypedFormGroup({
        _id: new UntypedFormControl(this.data._id),
        name: new UntypedFormControl(null),
        description: new UntypedFormControl(null),
        startDate: new UntypedFormControl(null),
        endDate: new UntypedFormControl(null),
        coverName: new UntypedFormControl(null),
        coverId: new UntypedFormControl(null),
      }),
      races: this._fb.array([])

    });
  }

  closeDialog(success) {
    this._dialogRef.close({success: success});
  }

  createItem(data): UntypedFormGroup {
    return this._fb.group({
      _id: data._id || null,
      event: data.event || this.form.get('base').get('_id').value,
      title: data.title,
      distance: data.distance,
      sex: data.sex,
      isSelection: data.isSelection,
      participants: this._fb.array([])
    });
  }

  addItem(data): void {
    this.showParticipantFor[Object.keys(this.showParticipantFor).length] = false;
    this.items = this.form.get('races') as UntypedFormArray;
    const newItem = this.createItem(data);
    this.items.push(newItem);
    this.addParticipants(newItem, data.participants);
  }

  deleteItem(race, index): void {
    if (race && race.value._id) {
      this._alertService.callSwal('confirm', {text: 'დარწმუნებული ხარ?', buttons: ['არა', 'კი']}, (confirm) => {
        if (confirm) {
          this._appService.raceEdit({data: {_id: race.value._id, recordState: 0}}).subscribe(res => {
            this.initForm();
            if (this.data._id) {
              this.getEventData();
            }
          });
        }
      });
    } else {
      this.items.removeAt(index);

    }
  }

  findRaces() {
    this._appService.findRace({data: {event: this.form.get('base').get('_id').value}}).subscribe(res => {
      if (res['success']) {
        res['data'].forEach((race, index) => {
          this.addItem(race);
        });
      }
    });
  }

  saveInfo(stepper) {
    if (!this.form.invalid) {
      let method = 'eventEdit';
      if (!this.id) {
        method = 'eventAdd';
      }
      this._loadingService.show();
      this._appService[method]({data: this.form.get('base').value}).subscribe(res => {
        this._loadingService.hide();
        if (!this.id) {
          this._dialogRef.close({success: res['success']});         
        } else{
          this.form.get('base').get('_id').setValue(this.data._id || res['data']['_id']);
          stepper.next();
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
        this.form.get('base').get(key + 'Name').setValue(res['data']['originalname']);
        this.form.get('base').get(key + 'Id').setValue(res['data']['filename']);
      }

    });
  }

  saveRaces() {
    this._loadingService.show();
    this._appService.addRace({data: {races: this.form.get('races').value}}).subscribe(res => {
      if (res['success']) {
        this.closeDialog(res['success']);
      }
      this._loadingService.hide();
    });
  }

  addParticipants(race, participants) {
    if(participants)
    participants.forEach(part=>{
      this.items = race.get('participants') as UntypedFormArray;
      const newItem = this.createParticipant(part);
      this.items.push(newItem)
    });
  /*  console.log(race.get('participants'),partss)
//partss formGroup
    race.get('participants').controls
      .specialRequests.push(partss)*/
  }
  deleteParticipant(prt, race, index){
    let participants = race.get('participants').controls;
    let val = race.get('participants').value;
    participants = participants.splice(index, 1);
    val = val.splice(index, 1);
  }

  createParticipant(data): UntypedFormGroup {
    return this._fb.group({
      fullName: data.fullName || null,
      team: data.team || null,
      minutes: data.minutes || 0,
      seconds: data.seconds || 0,
      milliseconds: data.milliseconds || 0,
    });
  }


}
