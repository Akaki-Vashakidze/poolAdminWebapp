import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AddCoachComponent} from './components/add-coach/add-coach.component';
import {AppService} from '../../service/app.service';
import {AlertService} from '../../service/alert.service';
import {LoadingService} from '../../service/loading.service';
import {Constants} from '../../extra/constants';
import {CoachGroupsComponent} from './components/coach-groups/coach-groups.component';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss']
})
export class CoachesComponent implements OnInit {
  sessionData = JSON.parse(localStorage.getItem('sessionData'));
  isAdmin = false;
  coaches = [];
  reqData = {
    recordState: this._constants.RECORD_STATE.ACTIVE
  };

  constructor(private _dialog: MatDialog,
              private _alertService: AlertService,
              private _appService: AppService,
              private _constants: Constants,
              private _loadingService: LoadingService) {
    this.isAdmin = this.sessionData.userGroupId === this._constants.adminUserGroupId;
  }

  ngOnInit() {
    this._loadData();
  }


  _loadData() {
    this._loadingService.show();
    this._appService.findCoach({data: this.reqData}).subscribe(res => {
      this._loadingService.hide();
      this.coaches = res['data'].map(t => {
          return {
            firstName: t.profile.firstName,
            lastName: t.profile.lastName,
            description: t.profile.description,
            pool: t.pool,
            avatar: t.profile.avatarId,
            cover: t.profile.coverId,
            _id: t._id,
          };
        }
      );
    }, err => this._loadingService.hide());
  }

  deleteCoach(coach) {
    this._alertService.callSwal('confirm', {text: 'დარწმუნებული ხარ?', buttons: ['არა', 'კი']}, (confirm) => {
      if (confirm) {
        this._loadingService.show();
        this._appService.coachEdit({data: {_id: coach._id, recordState: this._constants.RECORD_STATE.DELETED}}).subscribe(res => {
            if (res['success']) {
              this._loadData();
            }
          }, error1 => this._loadingService.hide()
        );
      }
    });
  }

  openCoachDialog(coach) {
    const dialog = this._dialog.open(AddCoachComponent, {
      disableClose: true,
      data: coach || {}
    });
    dialog.afterClosed().subscribe(res => {
      if (res && res['success']) {
        this._loadData();
      }
    });

  }

  openGroupsDialog(coach) {
    const dialog = this._dialog.open(CoachGroupsComponent, {
      disableClose: false,
      data: coach
    });
  }
}
