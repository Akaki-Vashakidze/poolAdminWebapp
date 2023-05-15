import {Injectable} from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private defaultConfig = {
    confirm: {
      icon: 'warning',
      text: 'Are You Sure ?',
      buttons: ['Yes', 'No'],
      dangerMode: true
    },
    info: {
      icon: 'info',
      dangerMode: false
    },
    error: {
      icon: 'warning',
      dangerMode: true
    }
  };

  constructor() {

  }

  callSwal(type, params, callBack?) {
    if (!callBack) {
      callBack = () => {};
    }
    const config = Object.assign(this.defaultConfig[type], params);
    swal.fire(config).then(callBack);
  }
}
