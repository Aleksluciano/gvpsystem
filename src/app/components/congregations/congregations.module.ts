import { CongregationsRoutingModule } from './congregations-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AddCongregationComponent } from './add-congregation/add-congregation.component';
import { FilterModule } from 'src/app/pipes/filter.module';

@NgModule({
  declarations: [
    AddCongregationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CongregationsRoutingModule,
    FilterModule
  ]
})
export class CongregationsModule { }
