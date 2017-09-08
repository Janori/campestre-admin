import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing, appRoutingProviders} from './app.routing';

import {MaterialModule, DateAdapter, NativeDateAdapter, MD_DATE_FORMATS} from '@angular/material';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { PartnersComponent } from './dashboard/partners/partners.component';
import { PartnerFormComponent } from './dashboard/partners/partner-form.component';
import { PoolComponent } from './dashboard/pool/pool.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    PartnersComponent,
    PartnerFormComponent,
    PoolComponent
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
    routing
  ],
  providers: [appRoutingProviders,
    {provide: DateAdapter, useClass: NativeDateAdapter},
     {provide: MD_DATE_FORMATS, useValue: 'yyyy-mm-dd'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }