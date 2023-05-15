import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { AppService } from '../../../service/app.service';
import { Constants } from '../../../extra/constants';
import { LoadingService } from '../../../service/loading.service';
import { AlertService } from '../../../service/alert.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  poolData: any[] = [];
  userData: any[] = [];
  gridOn = false;
  poolColumns = {
    groupCoach: 'მწვრთნელი,ჯგუფი',
    visitAmountP: 'ვიზიტების რაოდენობა / პაკეტი',
    cardStatus: 'ბარათის სტატუსი',
    startDate: 'დაწყების თარიღი',
    endDate: 'დასრულების თარიღი',
  };
  userColumns = {
    fullName: 'სახელი,გვარი',
    birthDate: 'დაბადების თარიღი',
    mobile: 'მობილური',
    phone: 'ტელეფონი',
    responsible: 'პასუხისმგებელი პირი'
  };
  userPaging = { length: 100, pageSize: 10, pageIndex: 0 };
  poolPaging = { length: 100, pageSize: 10, pageIndex: 0 };
  poolReqData = {
    data: {},
    paging: {
      page: 1,
      limit: this.gridOn ? 500 : 10
    }
  };
  userReqData = {
    data: {},
    paging: {
      page: 1,
      limit: this.gridOn ? 500 : 10
    }
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<HistoryComponent>,
    private _fb: UntypedFormBuilder,
    private _appService: AppService,
    private _constants: Constants,
    private _loadingService: LoadingService,
    private _alert: AlertService) {
    this.poolReqData.data['dataId'] = data.user._id;
    this.userReqData.data['dataId'] = data.user._id;
  }

  ngOnInit() {
    this.loadPoolData();
  }

  loadUserData() {
    this._loadingService.show();
    this._appService.getHistoryUser(this.userReqData).subscribe(res => {
      this._loadingService.hide();
      if (!this.gridOn) {
        res['data']['items'].push({ value: JSON.stringify(this.data.user) });
      }
      res['data']['totalItems'] = res['data']['totalItems'] + 1;
      this.userData = res['data']['items'].map(i => {
        const u = JSON.parse(i.value);
        const contact = u.contact ? u.contact.responsibleName : null,
          contactPhone = u.contact ? u.contact.responsiblePhone : null,
          responsible = contactPhone ? contact + '(' + contactPhone + ')' : null;
        return {
          fullName: u.profile.firstName + ' ' + u.profile.lastName,
          isVerified: u.isVerified,
          phone: u.contact ? u.contact.phone : null,
          mobile: u.contact ? u.contact.mobile : null,
          responsible: responsible,
          birthDate: new Date(u.profile.birthDate).toLocaleDateString(),
          timestamp: i.timestamp,
          _id: u._id,
        };
      });
      this.userPaging.length = res['data'].totalItems;


    }, error1 => this._loadingService.hide());


  }

  actionButton(el, action) {
    switch (action.key) {
    }
  }

  loadPoolData() {
    this._loadingService.show();
    this._appService.getHistoryPool(this.poolReqData).subscribe(res => {
      this._loadingService.hide();
      // if (!this.gridOn) {
      //   res['data']['items'].push({ value: JSON.stringify(this.data.user.pool) });
      // }
      res['data']['totalItems'] = res['data']['totalItems'] + 1;
      this.poolData = res['data']['items'].map(pool => {
        // const u = JSON.parse(i.value);
        const coach = pool.coach ? pool.coach.profile.firstName + ' ' + pool.coach.profile.lastName : null,
          group = pool.group ? pool.group.name : null,
          visitAmount = pool.package ? pool.package.visitAmount : null,
          visitAmountText = visitAmount ? pool.visited + ' ( ' + visitAmount + ' )' : null,
          packageP = pool.package ? pool.package.name : null,
          packVisitText = visitAmountText ? visitAmountText + ' / ' + packageP : packageP;
        return {
          groupCoach: group ? coach + ' ( ' + group + ' ) ' : coach,
          visitAmountP: packVisitText,
          cardStatus: pool.active ? 'აქტიური' : 'გასააქტიურებელი',
          endDate: new Date(pool.endDate).toLocaleDateString(),
          startDate: new Date(pool.startDate).toLocaleDateString(),
          timestamp: pool.fromDate,
          _id: pool._id,
        };
      });

      this.poolPaging.length = res['data'].totalItems;

    }, error1 => this._loadingService.hide());
  }


  tabChange(e) {
    this.userReqData.paging = {
      page: 1,
      limit: this.gridOn ? 500 : 10
    };
    this.poolReqData.paging = {
      page: 1,
      limit: this.gridOn ? 500 : 10
    };
    if (e.index) {
      this.loadUserData();
    } else {
      this.loadPoolData();
    }
  }

  closeDialog(success) {
    this._dialogRef.close({ success: success });
  }

  pageChange(ev, key) {
    switch (key) {
      case 'pool': {
        this.poolReqData.paging = {
          page: ev.pageIndex + 1,
          limit: ev.pageSize
        };
        this.loadPoolData();
      }
        break;
      case 'user': {
        this.userReqData.paging = {
          page: ev.pageIndex + 1,
          limit: ev.pageSize
        };
        this.loadUserData();
      }
        break;
    }
  }

  gridOnF(b) {
    this.tabChange({ index: 1 });
    this.tabChange({ index: 0 });
    this.gridOn = b;

  }
}
