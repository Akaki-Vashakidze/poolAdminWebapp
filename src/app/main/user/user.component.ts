import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {
  isLoggedIn = localStorage.getItem('sessionData');
  opened = true;
  menu = [
    {
      name: 'ჩემი პროფილი',
      icon: 'poll',
      style: {color: '#2196f3'},
      route: 'profile'
    },
    {
      name: 'მწვრთნელები',
      icon: 'person',
      style: {color: '#2196f3'},
      route: 'coaches'
    },
    {
      name: 'დასწრება',
      icon: 'list_alt',
      style: {color: '#2196f3'},
      route: 'attendance'
    }
  ];

  constructor(private _authService: AuthService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.opened = true;
    }, 500);
  }

  logout() {
    this._authService.logOut().subscribe();
  }
}
