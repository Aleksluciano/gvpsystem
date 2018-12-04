import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddReportComponent } from "./add-report/add-report.component";
import { ListReportsComponent } from "./list-reports/list-reports.component";
import { EditReportComponent } from "./edit-report/edit-report.component";
import { ReportDetailsComponent } from "./report-details/report-details.component";


const routes: Routes = [
  {path: "", component: ListReportsComponent},
  {path: "add", component: AddReportComponent},
  {path: "edit/:id", component: EditReportComponent},
  {path: ":id", component: ReportDetailsComponent},
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
