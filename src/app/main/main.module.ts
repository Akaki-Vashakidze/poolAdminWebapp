import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main.component';
import {MainRoutingModule} from './main-routing.module';
import {ScheduleComponent} from './schedule/schedule.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AttendanceComponent} from './attendance/attendance.component';
import {CustomersComponent} from './customers/customers.component';
import {TableComponent} from './components/table/table.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WizardComponent} from './wizard/wizard.component';
import {ProfileComponent} from './profile/profile.component';
import {UserComponent} from './user/user.component';
import {GroupsComponent} from './groups/groups.component';
import {CoachesComponent} from './coaches/coaches.component';
import {AddCoachComponent} from './coaches/components/add-coach/add-coach.component';
import {TreeComponent} from './groups/tree/tree.component';
import {PackagesComponent} from './groups/packages/packages.component';
import {CoachGroupsComponent} from './coaches/components/coach-groups/coach-groups.component';
import {HistoryComponent} from './customers/history/history.component';
import {FileComponent} from './components/file/file.component';
import {PoolComponent} from './customers/pool/pool.component';
import {LetsGoSwimmingDialogComponent} from './customers/lets-go-swimming-dialog/lets-go-swimming-dialog.component';
import {QRCodeModule} from 'angularx-qrcode';
import { UserInfoComponent } from './user-info/user-info.component';
import {WebcamModule} from 'ngx-webcam';
import { WebcamComponent } from './components/webcam/webcam.component';
import { EventComponent } from './event/event.component';
import { AddEventComponent } from './event/add-event/add-event.component';
import { EventParticipantsComponent } from './event/event-participants/event-participants.component';
import { EventInfoComponent } from './event/event-info/event-info.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MainRoutingModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        FlexLayoutModule,
        MatTableModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatStepperModule,
        MatSelectModule,
        MatCardModule,
        MatTreeModule,
        MatSortModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatTabsModule,
        QRCodeModule,
        WebcamModule,
        MatChipsModule,
        DragDropModule,
        SharedModule
    ],
    declarations: [MainComponent, ScheduleComponent, AttendanceComponent, CustomersComponent, TableComponent, WizardComponent, ProfileComponent, UserComponent, GroupsComponent, CoachesComponent, AddCoachComponent, TreeComponent, PackagesComponent, CoachGroupsComponent, FileComponent, HistoryComponent, PoolComponent, LetsGoSwimmingDialogComponent, UserInfoComponent, WebcamComponent, EventComponent, AddEventComponent, EventParticipantsComponent, EventInfoComponent],
    providers: [MatNativeDateModule]
})
export class MainModule {
}
