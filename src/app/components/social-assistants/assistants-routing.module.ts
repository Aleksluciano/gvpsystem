import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddAssistantComponent } from "./add-assistant/add-assistant.component";


const routes: Routes = [
  { path: "", component: AddAssistantComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AssistantsRoutingModule {}
