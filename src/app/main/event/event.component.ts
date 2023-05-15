import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AlertService} from '../../service/alert.service';
import {AppService} from '../../service/app.service';
import {Constants} from '../../extra/constants';
import {LoadingService} from '../../service/loading.service';
import {AddEventComponent} from './add-event/add-event.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  sessionData = JSON.parse(localStorage.getItem('sessionData'));
  isAdmin = false;
  events = [];
  reqData = {
    recordState: this._constants.RECORD_STATE.ACTIVE
  };

  constructor(private _dialog: MatDialog,
              private _alertService: AlertService,
              private _appService: AppService,
              private _constants: Constants,
              private _router: Router,
              private _loadingService: LoadingService) {
    this.isAdmin = this.sessionData.userGroupId === this._constants.adminUserGroupId;

  }

  ngOnInit() {

    this._loadData();

  }


  _loadData() {
    this._loadingService.show();
    this._appService.findEvents({data: this.reqData}).subscribe(res => {
      this._loadingService.hide();
      this.events = res['data'].map(t => {
          return {
            name: t.name,
            description: t.description,
            startDate: t.startDate,
            coverId: t.coverId,
            endDate: t.endDate,
            _id: t._id,
          };
        }
      );
    }, err => this._loadingService.hide());
  }

  deleteCoach(event) {
    this._alertService.callSwal('confirm', {text: 'დარწმუნებული ხარ?', buttons: ['არა', 'კი']}, (confirm) => {
      if (confirm) {
        this._loadingService.show();
        this._appService.eventEdit({data: {_id: event._id, recordState: this._constants.RECORD_STATE.DELETED}}).subscribe(res => {
            if (res['success']) {
              this._loadData();
            }
          }, error1 => this._loadingService.hide()
        );
      }
    });
  }

  openCoachDialog(coach) {
    const dialog = this._dialog.open(AddEventComponent, {
      disableClose: true,
      data: coach || {}
    });
    dialog.afterClosed().subscribe(res => {
      if (res && res['success']) {
        this._loadData();
      }
    });

  }

  navigateToEvent(event) {
    this._router.navigate(['/pool/events/'+event._id])
  }

}
