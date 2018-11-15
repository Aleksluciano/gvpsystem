import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxViacepModule } from '@brunoc/ngx-viacep';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { ListPatientsComponent } from './list-patients/list-patients.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { FilterModule } from './../../pipes/filter.module';
import { PatientsRoutingModule } from './patients-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';





@NgModule({
  declarations: [
    ListPatientsComponent,
    AddPatientComponent,
    EditPatientComponent,
    PatientDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PatientsRoutingModule,
    NgxViacepModule,
    RouterModule,
    FilterModule,
    HttpClientModule,
    AngularEditorModule
  ]
})
export class PatientsModule { }
