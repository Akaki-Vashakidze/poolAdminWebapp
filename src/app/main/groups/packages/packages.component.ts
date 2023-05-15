import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {AppService} from '../../../service/app.service';
import { MatDialog } from '@angular/material/dialog';
import {Constants} from '../../../extra/constants';
import {LoadingService} from '../../../service/loading.service';
import {AlertService} from '../../../service/alert.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  tableData = [];
  columns = {
    name: 'პაკეტი',
    visitAmount: 'ვიზიტი(თვეში)',
    duration: 'ხანგრძლივობა',
    priceGEL: 'ფასი'
  };
  paging = {length: 100, pageSize: 10, pageIndex: 0};
  actions = [
    {
      icon: 'edit', color: 'accent', key: 'edit', action: (el, action) => {
        this.actionButton(el, action);
      }
    },
    {
      icon: 'delete', color: 'warn', key: 'delete', action: (el, action) => {
        this.actionButton(el, action);
      }
    }

  ];
  showForm = false;
  addForm: UntypedFormGroup;
  reqData = {
    data: {
      recordState: this._constants.RECORD_STATE.ACTIVE
    },
    paging: {}
  };

  constructor(private _fb: UntypedFormBuilder,
              private _appService: AppService,
              private _matDialog: MatDialog,
              private _alert: AlertService,
              private _constants: Constants,
              private _loadingService: LoadingService) {
  }

  ngOnInit() {
    this.initForm();
    this._loadData();
  }

  initForm() {
    this.addForm = this._fb.group(
      {
        _id: [''],
        name: ['', Validators.required],
        duration: ['', Validators.required],
        visitAmount: ['', Validators.required],
        price: ['', Validators.required]
      }
    );
  }

  _loadData() {
    this._loadingService.show();
    this._appService.findPackage(this.reqData).subscribe(res => {
      if (res['success']) {
        this._loadingService.hide();
        this.tableData = res['data']['items'].map(r => {
          r.priceGEL = r.price + ' ₾ ';
          return r;
        });
        this.paging.length = res['data'].totalItems;
      }
    }, error1 => this._loadingService.hide());
  }

  actionButton(el, action) {
    switch (action.key) {
      case 'delete': {
        this._alert.callSwal('confirm', {text: 'დარწმუნებული ხარ?', buttons: ['არა', 'კი']}, (confirm) => {
          if (confirm) {
            const data = el;
            data.recordState = this._constants.RECORD_STATE.DELETED;
            this._appService.editPackage({data: data}).subscribe(res => {
              if (res['success']) {
                this._loadData();
              }
            });
          }
        });
      }
        break;
      case 'edit': {
        console.log(el);
        this.showForm = true;

        this.addForm.setValue({
          name: el.name,
          price: el.price,
          duration: el.duration,
          visitAmount: el.visitAmount,
          _id: el._id
        });
      }
        break;
    }
  }

  pageChange(ev) {
    this.reqData.paging = {
      page: ev.pageIndex + 1,
      limit: ev.pageSize
    };
    this._loadData();
  }

  toggleAddForm() {
    this.showForm = !this.showForm;
    this.addForm.reset();
  }

  savePackage() {
    if (!this.addForm.invalid) {
      this.showForm = false;
      let action = '';
      if (this.addForm.get('_id').value) {
        action = 'editPackage';
      } else {
        action = 'addPackage';

      }
      this._appService[action]({data: this.addForm.value}).subscribe(res => {
        if (res['success']) {
          this._loadData();
          this.addForm.reset();
        }
      });
    }
  }
}
