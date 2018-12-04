import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxViacepModule } from '@brunoc/ngx-viacep';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { ListReportsComponent } from './list-reports/list-reports.component';
import { AddReportComponent } from './add-report/add-report.component';
import { EditReportComponent } from './edit-report/edit-report.component';
import { ReportDetailsComponent } from './report-details/report-details.component';
import { FilterModule } from './../../pipes/filter.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';





@NgModule({
  declarations: [
    ListReportsComponent,
    AddReportComponent,
    EditReportComponent,
    ReportDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    NgxViacepModule,
    RouterModule,
    FilterModule,
    HttpClientModule,
    AngularEditorModule
  ]
})
export class ReportsModule { }
