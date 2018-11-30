import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

import { Subject } from 'rxjs';
import { map } from "rxjs/operators";

import { User } from './user.model';
import { FlashMessagesService } from 'angular2-flash-messages';


const BACKEND_URL = environment.apiUrl + "/users/";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[] = [];
  private user: User;
  private usersUpdated = new Subject<User[]>();
  private oneUserUpdated = new Subject<User>();
  private warnFlashMessage = new Subject<void>();


  constructor(
    private _flashMessagesService: FlashMessagesService,
    private http: HttpClient, private router: Router) { }

  createUser(user: User) {

    this.http
      .post<{ message: string; user: any }>(
        BACKEND_URL,
        user
      ).pipe(
        map(responseData =>
          <User>{
          id: responseData.user._id,
          firstName: responseData.user.firstName,
          lastName: responseData.user.lastName,
          email: responseData.user.email,
          mobilePhone: responseData.user.mobilePhone,
          phone: responseData.user.phone,
          cep: responseData.user.cep,
          state: responseData.user.state,
          city: responseData.user.city,
          neighborhood: responseData.user.neighborhood,
          address: responseData.user.address,
          numeral: responseData.user.numeral,
          complement: responseData.user.complement,
          congregation: responseData.user.congregation,
          perfil: responseData.user.perfil,
          region: responseData.user.region,
          password: responseData.user.password
        }
          )

      )
      .subscribe((newUser) => {

         this.users.unshift(newUser);
         this._flashMessagesService.show('Novo usuário adicionado', {
          cssClass: 'alert-success', timeout: 4000
        });
        this.usersUpdated.next([...this.users]);

      });
  }

  getUsersServer() {

    this.http
      .get<{ message: string; users: any[]}>(
        BACKEND_URL
      )
      .pipe(
        map(responseData => {
          return {
            users: responseData.users.map(user =>
              <User>{
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobilePhone: user.mobilePhone,
                phone: user.phone,
                cep: user.cep,
                state: user.state,
                city: user.city,
                neighborhood: user.neighborhood,
                address: user.address,
                numeral: user.numeral,
                complement: user.complement,
                congregation: user.congregation,
                perfil: user.perfil,
                region: user.region
              }
            )
          }
        })
      )
      .subscribe(responseData => {
        this.users = responseData.users;

        this.users.sort((a, b) => {
          if (a.firstName < b.firstName ) return -1;
          if (a.firstName > b.firstName ) return 1;
          return 0;
        });

        this.usersUpdated.next([...this.users]);
      });
  }

  getOneUserServer(id: string) {

    this.http
      .get<{ message: string; user: any}>(
        BACKEND_URL + id
      )
      .pipe(
        map(responseData => {
             return <User>{
                id: responseData.user._id,
                firstName: responseData.user.firstName,
                lastName: responseData.user.lastName,
                email: responseData.user.email,
                mobilePhone: responseData.user.mobilePhone,
                phone: responseData.user.phone,
                cep: responseData.user.cep,
                state: responseData.user.state,
                city: responseData.user.city,
                neighborhood: responseData.user.neighborhood,
                address: responseData.user.address,
                numeral: responseData.user.numeral,
                complement: responseData.user.complement,
                congregation: responseData.user.congregation,
                perfil: responseData.user.perfil,
                region: responseData.user.region
              }
            }
        )
        )

      .subscribe(responseData => {
        this.user = responseData;
        this.oneUserUpdated.next(this.user);
      });
  }

  get Users(){
    return this.users || [];
  }

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getOneUserUpdateListener() {
    return this.oneUserUpdated.asObservable();
  }



  deleteUser(id: string) {
    return this.http.delete(BACKEND_URL + id).subscribe(() =>{
      this.users.forEach((u, index) => {
        if(u.id == id) this.users.splice(index, 1);
      });
      this._flashMessagesService.show('Usuário removido', {
        cssClass: 'alert-success', timeout: 4000
      });
      this.usersUpdated.next([...this.users]);
      //this.warnFlashMessage.next();
    })
  }

  getUser(id: string) {
    let user = this.users.filter(u => u.id == id);
    return user[0];
  }

  updateUser(id: string, user: User) {
  this.http
  .put(BACKEND_URL + id, user)
  .subscribe(responseData => {
    this.users = this.users.map(u => {
       if(u.id == id) u = user;
       return u;
    });
  this._flashMessagesService.show("Usuário atualizado", {
        cssClass: "alert-success",
        timeout: 4000
      });
      this.router.navigate(['/']);
    // this.warnFlashMessage.next();
  });
}


warnFlashMessageListener(){
  return this.warnFlashMessage.asObservable();
}

}
