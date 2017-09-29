import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing, appRoutingProviders} from './app.routing';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/security/auth.guard';

import { MaterialModule, MdNativeDateModule, MD_DATE_FORMATS} from '@angular/material';
import { LOCALE_ID } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { PartnersComponent } from './dashboard/partners/partners.component';
import { PartnerFormComponent } from './dashboard/partners/partner-form.component';
import { PoolComponent } from './dashboard/pool/pool.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    PartnersComponent,
    PartnerFormComponent,
    PoolComponent,
    NotificationsComponent,
    LoginComponent
  ],
  entryComponents: [
      PartnerFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    MdNativeDateModule,
    routing
  ],
  providers: [
      { provide: LOCALE_ID, useValue: 'es-MX' },
      appRoutingProviders,
      AuthService,
      AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
