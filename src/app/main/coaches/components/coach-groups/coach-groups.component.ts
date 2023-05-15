import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AppService} from '../../../../service/app.service';
import {LoadingService} from '../../../../service/loading.service';
import {AlertService} from '../../../../service/alert.service';

@Component({
  selector: 'app-coach-groups',
  templateUrl: './coach-groups.component.html',
  styleUrls: ['./coach-groups.component.scss']
})
export class CoachGroupsComponent implements OnInit {
  coach = null;
  sessionData = JSON.parse(localStorage.getItem('sessionData'));
  isAdmin = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _dialogRef: MatDialogRef<CoachGroupsComponent>,
              private _alertService: AlertService,
              private _loadingService: LoadingService,
              private _appService: AppService) {
    this.isAdmin = this.sessionData.userGroupId === 1000;
    this.coach = data;
  }

  ngOnInit() {
  }

  panelOpened(group) {
    console.log(group);
    this.getUsersOfGroup(group);
  }

  getUsersOfGroup(group) {
    const reqData = {
      data: {
        'pool.group': group._id,
        'pool.coach': this.coach._id,
        'pool.active': true
      },
      paging: {
        limit: 1999,
        page: 1
      }
    };
    this._loadingService.show();
    this._appService.findUser(reqData).subscribe(res => {
      if (res['success']) {
        group['users'] = res['data']['items'];
      }
      this._loadingService.hide();
    }, err => this._loadingService.hide());
  }

  getStatus(pool) {
    const active = new Date(pool.startDate) < new Date() && new Date() < new Date(pool.endDate);
    return active ? 'ვადაში' : 'ვადის გარეთ';
  }

  enrollToGroup(group) {

    this._alertService.callSwal('confirm', {text: 'დარწმუნებული ხარ?', buttons: ['არა', 'კი']}, (confirm) => {
      if (confirm) {
        this._loadingService.show();
        this._appService.userEdit({data: {_id: this.sessionData._id, pool: {coach: this.coach._id, group: group._id}}}).subscribe(res => {
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
