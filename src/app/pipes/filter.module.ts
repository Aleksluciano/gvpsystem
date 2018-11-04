import { FilterPipe } from 'src/app/pipes/filter.pipe';

import { NgModule } from '@angular/core';







@NgModule({
  declarations: [
    FilterPipe
  ],
  exports: [
    FilterPipe
  ]
})
export class FilterModule { }
