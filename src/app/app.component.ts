import {Component, OnInit} from '@angular/core';
import {LoadingService} from './service/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  loading: boolean;

  constructor(private _loadingService: LoadingService) {
  }
  ngOnInit() {
    this._loadingService.loading.subscribe((loading) => {
      setTimeout(() => {
        this.loading = loading;
      });
    });
  }
}
