import { BeginComponent } from './components/begin/begin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router'

const routes: Routes = [

  {path: "", component: BeginComponent},
  {path: "users", loadChildren: "./components/users/users.module#UsersModule"},
  {path: "congregations", loadChildren: "./components/congregations/congregations.module#CongregationsModule"},
  {path: "hospitals", loadChildren: "./components/hospitals/hospitals.module#HospitalsModule"},
  {path: "accommodations", loadChildren: "./components/accommodations/accommodations.module#AccommodationsModule"},
  {path: "assistants", loadChildren: "./components/social-assistants/assistants.module#AssistantsModule"},
  {path: "patients", loadChildren: "./components/patients/patients.module#PatientsModule"},
  {path: "reports", loadChildren: "./components/reports/reports.module#ReportsModule"},
]

@NgModule({
  // {scrollPositionRestoration: 'enabled'} make the scroll on top when change the component
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
