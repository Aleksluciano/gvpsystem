import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material";



import { FlashMessagesModule } from 'angular2-flash-messages';

import { UsersModule } from './components/users/users.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';






@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ErrorComponent,
    ConfirmModalComponent,
    InfoModalComponent
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    UsersModule,
    FlashMessagesModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent,ConfirmModalComponent,InfoModalComponent]
})
export class AppModule { }
