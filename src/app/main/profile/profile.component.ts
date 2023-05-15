import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {WizardComponent} from '../wizard/wizard.component';
import {LoadingService} from '../../service/loading.service';
import {AppService} from '../../service/app.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  userId: string = JSON.parse(localStorage.getItem('sessionData'))['_id'];
  isVerified: Boolean = true;
  user;
  tabs = {
    list: [
      {label: 'აუზი', key: 'pool'},
      {label: 'ბარათი', key: 'card'},
      {label: 'ისტორია', key: 'history'},
    ],
    selected: {label: 'აუზი', key: 'pool'}
  };

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router, private _dialog: MatDialog, private _appService: AppService, private _loadingService: LoadingService) {
    this._activatedRoute.params.subscribe(params => {
      if (params.isVerified) {
        this.isVerified = (params.isVerified === 'true');
      }
      if (!this.userId) {
        this._router.navigate(['/']);
      }
    });
  }

  ngOnInit() {
    this.getUserdata();
  }

  openWizard() {
    this._dialog.open(WizardComponent, {
      disableClose: true,
      data: {
        user: {
          _id: this.userId,
          isPackageEdit: false
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isVerified) {
      setTimeout(() => {
        this.openWizard();
      });
    }
  }

  getUserdata() {
    this._loadingService.show();
    this._appService.findUserByIdWithPopulation({data: {_id: this.userId}}).subscribe(res => {
      this.user = res['data'];
      this._loadingService.hide();
    }, error1 => {
      this._loadingService.hide();
    });
  }
  tabChange(e) {
    this.tabs.selected = this.tabs.list[e.index];
  }
}
