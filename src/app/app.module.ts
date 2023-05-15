import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {MainModule} from './main/main.module';
import {AuthGuardService} from './Auth/authguard.service';
import {AuthService} from './service/auth.service';
import {AuthComponent} from './Auth/components/auth/auth.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ANIMATION_TYPES, LoadingModule} from 'ngx-loading';
import {LoadingService} from './service/loading.service';
import {RegisterComponent} from './Auth/components/register/register.component';
import {AlertService} from './service/alert.service';
import {AppService} from './service/app.service';
import {AdminPermissionService} from './Auth/admin-permission.service';
import {UserPermissionService} from './Auth/user-permission.service';
import {Constants} from './extra/constants';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RegisterComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    LoadingModule.forRoot({animationType: ANIMATION_TYPES.threeBounce}),
    MainModule
  ],
  providers: [AuthService, AuthGuardService, LoadingService, AlertService, AppService, AdminPermissionService, UserPermissionService, Constants],
  bootstrap: [AppComponent]
})
export class AppModule {
}
