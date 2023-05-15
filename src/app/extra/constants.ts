import {Injectable} from '@angular/core';

@Injectable()
export class Constants {
  adminUserGroupId = 1000;
  userUserGroupId = 1;
  qrcodeUrl = location.origin + '/#/pool/visit/';
  RECORD_STATE = {
    ACTIVE: 1,
    DELETED: 0,
    INACTIVE: 2
  };
  HISTORY = {
    DATA_TYPE: {
      USER: 1,
      COACH: 10,
    },
    CHANGE_TYPE: {
      NEW_PACKAGE: 1,
      BUG_FIX: 2,
      USER_INFO: 3,
      OTHER: 4
    }
  };

}
