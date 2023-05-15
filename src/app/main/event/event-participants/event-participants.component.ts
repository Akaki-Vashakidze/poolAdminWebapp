import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AlertService} from '../../../service/alert.service';
import {LoadingService} from '../../../service/loading.service';
import {AppService} from '../../../service/app.service';
import {Constants} from '../../../extra/constants';

@Component({
  selector: 'app-event-participants',
  templateUrl: './event-participants.component.html',
  styleUrls: ['./event-participants.component.scss']
})
export class EventParticipantsComponent implements OnInit {
  event = null;
  sessionData = JSON.parse(localStorage.getItem('sessionData'));
  isAdmin = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _dialogRef: MatDialogRef<EventParticipantsComponent>,
              private _alertService: AlertService,
              private _constants: Constants,
              private _loadingService: LoadingService,
              private _appService: AppService) {
    this.isAdmin = this.sessionData.userGroupId === this._constants.adminUserGroupId;
    this.event = data;
  }

  ngOnInit() {
  }

  panelOpened(group) {
    console.log(group);
  }


  getStatus(pool) {
    const active = new Date(pool.startDate) < new Date() && new Date() < new Date(pool.endDate);
    return active ? 'ვადაში' : 'ვადის გარეთ';
  }

  enrollToGroup(group) {

    this._alertService.callSwal('confirm', {text: 'დარწმუნებული ხარ?', buttons: ['არა', 'კი']}, (confirm) => {
      if (confirm) {
        this._loadingService.show();
        this._appService.userEdit({data: {_id: this.sessionData._id, pool: {coach: this.event._id, group: group._id}}}).subscribe(res => {
            if (res['success']) {
              // this._loadData();
              this._dialogRef.close(true);
            }
            this._loadingService.hide();
          }, error1 => this._loadingService.hide()
        );
      }
    });
  }
}
