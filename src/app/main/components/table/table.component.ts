import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

interface Action {
  icon: string;
  color: string;
  toolTip:string;
  action: Function;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() data: Object[];
  @Input() selectable: Boolean = false;
  @Input() sortable: Boolean = false;
  @Input() columns: Object;
  @Input() sortableColumns: string[] = [];
  @Input() paging: { length: number, pageSize: number, pageIndex: number };
  @Input() pageSizeOptions: Number[] = [5, 10, 25, 100];
  @Input() actions: Action[] = [];
  @Output() pageChange: EventEmitter<{ length: number, pageSize: number, pageIndex: number }> = new EventEmitter();
  @Output() checkChange: EventEmitter<any> = new EventEmitter();
  @Output() sortChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = [];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selection.select(...this.dataSource.data);
    this.emitCheckboxValue();
  }

  checkBoxChange(e, row) {
    this.selection.toggle(row);
    this.emitCheckboxValue();
  }

  constructor() {
  }

  ngOnInit() {
    console.log(this.data)
    this.initTable();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const d of Object.keys(this)) {
      if (changes[d]) {
        this[d] = changes[d].currentValue;
      }
    }
    this.initTable();
  }

  initTable() {
    this.displayedColumns = Object.keys(this.columns);
    this.dataSource = new MatTableDataSource<any>(this.data);
    if (this.selectable) {
      this.displayedColumns.unshift('select');
    }
    if (this.sortable) {
      this.dataSource.sort = this.sort;
    }
    if (this.actions.length) {
      this.displayedColumns.push('actions');
    }
  }

  get displayColumns() {
    return Object.keys(this.columns);
  }

  isSortingDisabled(col) {
    if (!this.sortable) {
      return true;
    } else {
      if (this.sortableColumns.length) {
        return this.sortableColumns.indexOf(col) < 0;
      } else {
        return false;
      }
    }
  }

  page(e) {
    this.pageChange.emit(e);
  }

  emitCheckboxValue() {
    this.checkChange.emit(this.selection.selected);
  }

  sortEvent(ev) {
    this.sortChange.emit(ev);
  }

  actionClick(e, element, act) {
    e.stopPropagation();
    act.action(element, act);
  }
}

