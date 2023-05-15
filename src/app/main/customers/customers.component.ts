import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AppService } from '../../service/app.service';
import { WizardComponent } from '../wizard/wizard.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../service/alert.service';
import { Constants } from '../../extra/constants';
import { LoadingService } from '../../service/loading.service';
import { HistoryComponent } from './history/history.component';
import { PoolComponent } from './pool/pool.component';
import { LetsGoSwimmingDialogComponent } from './lets-go-swimming-dialog/lets-go-swimming-dialog.component';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  tableData: any[] =  [
    {
    fullName: 'აკაკი ვაშაკიძე',
    isVerified: true,
    groupCoach: 'ნოდო მარგველაშვილი',
    visitAmountP: 3,
    cardStatus: 'აქტიური',
    endDate: '22/01/19',
    birthDate: '01/02/2002',
    _id: 923958932842304,
    code: 221,
  },
  {
    fullName: 'აკაკი ვაშაკიძე',
    isVerified: true,
    groupCoach: 'ნოდო მარგველაშვილი',
    visitAmountP: 3,
    cardStatus: 'აქტიური',
    endDate: '22/01/19',
    birthDate: '01/02/2002',
    _id: 923958932842304,
    code: 221,
  },
  {
    fullName: 'აკაკი ვაშაკიძე',
    isVerified: true,
    groupCoach: 'ნოდო მარგველაშვილი',
    visitAmountP: 3,
    cardStatus: 'აქტიური',
    endDate: '22/01/19',
    birthDate: '01/02/2002',
    _id: 923958932842304,
    code: 221,
  },
  {
    fullName: 'აკაკი ვაშაკიძე',
    isVerified: true,
    groupCoach: 'ნოდო მარგველაშვილი',
    visitAmountP: 3,
    cardStatus: 'აქტიური',
    endDate: '22/01/19',
    birthDate: '01/02/2002',
    _id: 923958932842304,
    code: 221,
  },
]

  columns = {
    fullName: 'სახელი,გვარი',
    birthDate: 'დაბადების თარიღი',
    groupCoach: 'მწვრთნელი,ჯგუფი',
    visitAmountP: 'ვიზიტების რაოდენობა / პაკეტი',
    endDate: 'ვადა',
    cardStatus: 'ბარათის სტატუსი'
  };
  paging = { length: 100, pageSize: 10, pageIndex: 0 };
  pageSizeOptions = [5, 10, 25, 400];

  actions = [
    {
      icon: 'face', color: 'primary', key: 'profile', toolTip: 'პროფილი', action: (el, action) => {
        this.actionButton(el, action);
      }
    },
    {
      icon: 'edit', color: 'accent', key: 'edit', toolTip: 'რედაქტირება', action: (el, action) => {
        this.actionButton(el, action);
      }
    },
    {
      icon: 'credit_card', color: 'primary', key: 'package', toolTip: 'პაკეტი,ბარათი', action: (el, action) => {
        this.actionButton(el, action);
      }
    },
    {
      icon: 'history', color: 'primary', key: 'history', toolTip: 'ისტორია', action: (el, action) => {
        this.actionButton(el, action);
      }
    },
    {
      icon: 'pool', color: 'primary', key: 'pool', toolTip: 'საშვი', action: (el, action) => {
        this.actionButton(el, action);
      }
    },
    {
      icon: 'delete', color: 'warn', key: 'delete', toolTip: 'წაშლა', action: (el, action) => {
        this.actionButton(el, action);
      }
    }
  ];
  searchForm: UntypedFormGroup;
  reqData = {
    data: {},
    paging: {
      page: 1,
      limit: 10
    }
  };
  groups = {
    data: []
  };
  packages = {
    data: []
  };
  coaches = {
    data: []
  };
  poolCardStatuses = {
    data: [
      { name: 'აქტიური', value: true },
      { name: 'არააქტიური', value: false }
    ]
  };

  constructor(private _fb: UntypedFormBuilder,
    private _appService: AppService,
    private _router: Router,
    private _matDialog: MatDialog,
    private _constants: Constants,
    private _loadingService: LoadingService,
    private _alert: AlertService) {
    this.searchForm = _fb.group({
      recordState: [this._constants.RECORD_STATE.ACTIVE],
      profile: this._fb.group({
        firstName: null,
        lastName: null,
        birthDate: null,
      }),
      pool: this._fb.group({
        group: null,
        package: null,
        coach: null,
        startDate: null,
        endDate: null,
        active: null
      })
    });
    this.searchForm = _fb.group({
      recordState: [this._constants.RECORD_STATE.ACTIVE],
      profile: this._fb.group({
        firstName: null,
        lastName: null,
        birthDate: null,
      }),
      pool: this._fb.group({
        group: null,
        package: null,
        coach: null,
        startDate: null,
        endDate: null,
        active: null
      })
    });
  }

  ngOnInit() {
    this._loadData();
    this.getGroups();
    this.getCoaches();
    this.getPackages();
    // this.searchForm.valueChanges.pipe(debounceTime(300)).subscribe(r => {
    //   this._loadData();
    // });
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
        coachId: this.searchForm.get('pool').get('coach').value
      }
    };
    this._appService.getGroupsByCoach(reqData).subscribe(res => {
      this.groups.data = res['data'].filter(t => t.parentId);
    });
  }

  getCoaches() {
    this._appService.findCoach({ data: { recordState: this._constants.RECORD_STATE.ACTIVE } }).subscribe(res => {
      this.coaches.data = res['data'];
    });
  }

  _loadData() {
    this._loadingService.show();
    this.reqData.data = this.transformReqData();
    this._appService.findUser(this.reqData).subscribe(res => {
      this._loadingService.hide();
      // this.tableData = res['data']['items'].map(u => {
      //   let coach = u.pool && u.pool.coach ? u.pool.coach.profile.firstName + ' ' + u.pool.coach.profile.lastName : null,
      //     group = u.pool && u.pool.group ? u.pool.group.name : null,
      //     visitAmount = u.pool && u.pool.package ? u.pool.package.visitAmount : null,
      //     poolVisited = u.pool && u.pool.visited ? u.pool.visited : 0,
      //     visitAmountText = visitAmount ? poolVisited + ' ( ' + visitAmount + ' )' : poolVisited,
      //     packageP = u.pool && u.pool.package ? u.pool.package.name : null,
      //     packVisitText = visitAmountText ? visitAmountText + ' / ' + packageP : packageP;
      //   return {
      //     fullName: u.profile.firstName + ' ' + u.profile.lastName,
      //     isVerified: u.isVerified,
      //     groupCoach: coach ? coach + ' ( ' + group + ' ) ' : null,
      //     visitAmountP: packVisitText,
      //     cardStatus: u.pool && u.pool.active ? 'აქტიური' : 'არააქტიური',
      //     endDate: new Date(u.pool ? u.pool.endDate : null).toLocaleDateString(),
      //     birthDate: new Date(u.profile.birthDate).toLocaleDateString(),
      //     _id: u._id,
      //     code: u.card ? u.card.code : null,
      //   };
      // });


      
      this.paging.length = res['data'].totalItems;


    }, error1 => this._loadingService.hide());
  }

  transformReqData() {
    const t = this.searchForm.value,
      value = {};
    Object.keys(t).forEach(p => {
      if (typeof t[p] !== 'object') {
        value[p] = t[p];
      } else {
        Object.keys(t[p]).forEach(c => {
          if (t[p][c] || t[p][c] === false) {
            value[p + '.' + c] = t[p][c];
          }
        });
      }

    });
    return value;
  }

  getStatus(pool) {
    if (!pool.startDate) {
      return 'გასააქტიურებელი';
    }
    const status = new Date(pool.startDate) < new Date() && new Date() < new Date(pool.endDate);
    return status ? 'აქტიური' : 'ვადაგასული';
  }

  onCheck(ev) {
    console.log(ev);
  }

  pageChange(ev) {
    this.reqData.paging = {
      page: ev.pageIndex + 1,
      limit: ev.pageSize
    };
    this._loadData();
  }

  sortChange(ev) {
    console.log(ev);
  }

  actionButton(el, action) {
    switch (action.key) {
      case 'delete': {
        this._alert.callSwal('confirm', { text: 'დარწმუნებული ხარ?', buttons: ['არა', 'კი'] }, (confirm) => {
          if (confirm) {
            this.deleteUser(el);
          }
        });
      }
        break;
      case 'package': {
        if (el.isVerified) {
          this.openWizardDialog(el, true);
        }
      }
        break;
      case 'history': {
        if (el.isVerified) {
          this.openHistoryDialog(el);
        }
      }
        break;
      case 'edit': {
        this.openWizardDialog(el, false);
      }
        break;
      case 'pool': {
        this.openPoolDialog(el);
      }
        break;
      case 'profile': {
        this._router.navigate(['/pool/user/' + el._id]);
      }
        break;
    }
  }

  search() {
    this._loadData();
  }

  deleteUser(user) {
    const data = {
      _id: user._id,
      recordState: this._constants.RECORD_STATE.DELETED
    };
    this._loadingService.show();
    this._appService.userEdit({ data: data }).subscribe(res => {
      this._loadingService.hide();
      if (res['success']) {
        this._loadData();
      }
    });
  }

  openWizardDialog(data, isPackageEdit) {
    const dialog = this._matDialog.open(WizardComponent, {
      disableClose: true,
      data: {
        user: data || {},
        isPackageEdit: isPackageEdit
      }
    });
    dialog.afterClosed().subscribe(res => {
      if (res && res['success']) {
        this._loadData();
      }
    });
  }

  openPoolDialog(data) {
    const dialog = this._matDialog.open(LetsGoSwimmingDialogComponent, {
      disableClose: true,
      data: {
        user: data || {}
      }
    });
    dialog.afterClosed().subscribe(res => {
      if (res && res['success']) {
        this._loadData();
      }
    });
  }

  openHistoryDialog(data) {
    this._appService.findUserByIdWithPopulation({ data: { _id: data._id } }).subscribe(resp => {
      if (resp['success']) {
        const dialog = this._matDialog.open(HistoryComponent, {
          disableClose: true,
          data: {
            user: resp['data'] || {}
          }
        });
        dialog.afterClosed().subscribe(res => {
          if (res && res['success']) {
            this._loadData();
          }
        });
      }
    });

  }

  resetSearchForm() {
    this.searchForm.reset({ recordState: this._constants.RECORD_STATE.ACTIVE });
    this._loadData();
  }

  resetField(key, $event) {
    // $event.preventDefault();
    $event.stopPropagation();
    this.searchForm.get(key).reset();
  }

  firstNameChanged(firstName:string){
    console.log(firstName, 'movida')
  }
}
