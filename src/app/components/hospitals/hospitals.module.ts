import { NgxViacepModule } from '@brunoc/ngx-viacep';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AddHospitalComponent } from "./add-hospital/add-hospital.component";
import { FilterModule } from 'src/app/pipes/filter.module';
import { HospitalsRoutingModule } from './hospitals-routing.module';

@NgModule({
  declarations: [
    AddHospitalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HospitalsRoutingModule,
    FilterModule,
    NgxViacepModule
  ]
})
export class HospitalsModule { }
