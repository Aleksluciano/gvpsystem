import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddUserComponent } from "./add-user/add-user.component";
import { ListUsersComponent } from "./list-users/list-users.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { UserDetailsComponent } from "./user-details/user-details.component";


const routes: Routes = [
  {path: "", component: ListUsersComponent},
  {path: "add", component: AddUserComponent},
  {path: "edit/:id", component: EditUserComponent},
  {path: ":id", component: UserDetailsComponent},
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
