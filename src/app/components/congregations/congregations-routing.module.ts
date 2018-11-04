import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddCongregationComponent } from "./add-congregation/add-congregation.component";


const routes: Routes = [
  { path: "", component: AddCongregationComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CongregationsRoutingModule {}
