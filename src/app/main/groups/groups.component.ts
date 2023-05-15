import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {AppService} from '../../service/app.service';
import {LoadingService} from '../../service/loading.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  groupForm: UntypedFormGroup;
  data: any[] = [];

  constructor(private _fb: UntypedFormBuilder, private _appService: AppService, private _loadingService: LoadingService) {
    this.groupForm = this._fb.group({
      description: ['']
    });
  }

  ngOnInit() {
    this.find();
  }


  action(e) {
    switch (e.action) {
      case 'insert':
        this.insert(e.data);
        break;
      case 'delete':
        this.delete(e.data);
        break;
      case 'select':
        this.select(e.data);
        break;
    }
  }

  find() {
    this._loadingService.show();
    this._appService.findGroups({}).subscribe(res => {
        this.data = res['data'].map(t => {
          return {id: t._id, item: t.name, parentId: t.parentId};
        });
        this._loadingService.hide();

      }, error => this._loadingService.hide()
    );
  }

  insert(e) {
    this._loadingService.show();
    this._appService.insertGroup({data: e}).subscribe(res => {
        if (res['success']) {
          this.find();
        }
        this._loadingService.hide();

      }, error => this._loadingService.hide()
    );
  }

  delete(e) {
    this._loadingService.show();
    this._appService.deleteGroup({data: e}).subscribe(res => {
        if (res['success']) {
          this.find();
        }
        this._loadingService.hide();

      }, error => this._loadingService.hide()
    );
    // this.data = this.data.filter(t => t.id !== e.id);
  }

  select(e) {
    console.log(e);
  }
}
