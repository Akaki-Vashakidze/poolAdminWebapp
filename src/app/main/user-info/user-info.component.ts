import {Component, OnInit} from '@angular/core';
import {AppService} from '../../service/app.service';
import {ActivatedRoute} from '@angular/router';
import {LoadingService} from '../../service/loading.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  userId;
  user;
  tabs = {
    list: [
      {label: 'აუზი', key: 'pool'},
      {label: 'ბარათი', key: 'card'},
      {label: 'ისტორია', key: 'history'},
    ],
    selected: {label: 'აუზი', key: 'pool'}
  };

  constructor(private _activatedRoute: ActivatedRoute, private _appService: AppService, private _loadingService: LoadingService) {
    this._activatedRoute.params.subscribe(params => {
      if (params.userId) {
        this.userId = params.userId;
      }
    });
  }

  ngOnInit() {
    this.getUserdata();
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
