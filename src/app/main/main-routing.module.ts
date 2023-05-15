import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {AttendanceComponent} from './attendance/attendance.component';
import {CustomersComponent} from './customers/customers.component';
import {AuthGuardService} from '../Auth/authguard.service';
import {ProfileComponent} from './profile/profile.component';
import {AdminPermissionService} from '../Auth/admin-permission.service';
import {UserComponent} from './user/user.component';
import {UserPermissionService} from '../Auth/user-permission.service';
import {GroupsComponent} from './groups/groups.component';
import {CoachesComponent} from './coaches/coaches.component';
import {PoolComponent} from './customers/pool/pool.component';
import {UserInfoComponent} from './user-info/user-info.component';
import {EventComponent} from './event/event.component';
import {EventInfoComponent} from './event/event-info/event-info.component';

const routes: Routes = [
  {
    path: 'pool',
    component: MainComponent,
    canActivate: [AuthGuardService, AdminPermissionService],
    children: [
      {path: '', redirectTo: 'customers', pathMatch: 'full'},
      {
        path: 'customers',
        component: CustomersComponent,
        children: []
      },
      {
        path: 'groups',
        component: GroupsComponent,
        children: []
      },
      {
        path: 'coaches',
        component: CoachesComponent,
        children: []
      },
      {
        path: 'events',
        component: EventComponent,
        children: []
      },
      {
        path: 'events/:eventId',
        component: EventInfoComponent,
        children: []
      },
      {
        path: 'visit/:code',
        component: PoolComponent,
        children: []
      },
      {
        path: 'user/:userId',
        component: UserInfoComponent,
        children: []
      }
    ]
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuardService, UserPermissionService],
    children: [
      {
        path: 'profile/:isVerified',
        component: ProfileComponent,
        children: []
      },
      {
        path: 'profile',
        component: ProfileComponent,
        children: []
      },
      {
        path: 'attendance',
        component: AttendanceComponent,
        children: []
      },
      {
        path: 'coaches',
        component: CoachesComponent,
        children: []
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
