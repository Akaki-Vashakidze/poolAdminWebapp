import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  @Input() accept: string;
  @Input() placeholder: string;
  @Input() disabled: boolean;
  @Input() icon = 'picture_as_pdf';
  @Input() iconColor = 'warn';
  @Input() value: string = null;
  @Output() fileChange: EventEmitter<File> = new EventEmitter();
  @Output() picture: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('fileInput', { static: true })
  private _fileInput: ElementRef<HTMLInputElement>;

  constructor() {
  }

  get files() {
    return this._fileInput.nativeElement.files;
  }

  ngOnInit() {
  }

  onChange() {

    this.fileChange.emit(this.files[0] || null);
  }


  clear() {
    this.value = null;
  }

  downloadFile() {
    const url = window.URL.createObjectURL(this.value as any);
    window.open(url, '_blank');
  }

  takePicture() {
    this.picture.emit(true);

  }

}
