import {Component, OnInit} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {LoadingService} from '../service/loading.service';
import {ActivatedRoute, Router} from '@angular/router';
import { ShareService } from '../service/share.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  user:any;
  opened = true;
  menu = [
    {
      name: 'მომხმარებლები',
      icon: 'people',
      style: {color: '#2196f3'},
      route: 'customers'
    },
    {
      name: 'მწვრთნელები',
      icon: 'person',
      style: {color: '#2196f3'},
      route: 'coaches'
    },
    {
      name: 'ჯგუფები / პაკეტები',
      icon: 'filter',
      style: {color: '#2196f3'},
      route: 'groups'
    },
    {
      name: 'შეჯიბრები',
      icon: 'pool',
      style: {color: '#2196f3'},
      route: 'events'
    }
  ];

  constructor(private _authService: AuthService, private _loadingService: LoadingService, private router: Router,private _share: ShareService) {
    if(router.url.indexOf('/visit/')>-1){
      this.opened = false;
    } else{
      this.opened = true;
    }
    // router.params.subscribe(re=>{
    //   console.log(re)
    // })
  }

  ngOnInit() {
    this._share.getUser().subscribe(userInfo=>{
      console.log(userInfo, "shemovida ;")
      this.user = userInfo;
    })
  }

  logout() {
    this._loadingService.show();
    this._authService.logOut().subscribe(r => {
      this._loadingService.hide();
    }, er => {
      this._loadingService.hide();
    });
  }
}
