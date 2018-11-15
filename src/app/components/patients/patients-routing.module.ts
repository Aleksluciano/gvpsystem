import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddPatientComponent } from "./add-patient/add-patient.component";
import { ListPatientsComponent } from "./list-patients/list-patients.component";
import { EditPatientComponent } from "./edit-patient/edit-patient.component";
import { PatientDetailsComponent } from "./patient-details/patient-details.component";


const routes: Routes = [
  {path: "", component: ListPatientsComponent},
  {path: "add", component: AddPatientComponent},
  {path: "edit/:id", component: EditPatientComponent},
  {path: ":id", component: PatientDetailsComponent},
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PatientsRoutingModule {}
