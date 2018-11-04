import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router'

import { AddUserComponent } from './components/users/add-user/add-user.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { UserDetailsComponent } from './components/users/user-details/user-details.component';
import { ListUsersComponent } from './components/users/list-users/list-users.component';


const routes: Routes = [

  {path: "", component: ListUsersComponent},
  {path: "user/add", component: AddUserComponent},
  {path: "user/edit/:id", component: EditUserComponent},
  {path: "user/:id", component: UserDetailsComponent},
  {path: "congregations", loadChildren: "./components/congregations/congregations.module#CongregationsModule"}
]

@NgModule({
  // {scrollPositionRestoration: 'enabled'} make the scroll on top when change the component
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
