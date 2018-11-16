import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Congregation } from "./congregation.model";
import { FlashMessagesService } from "angular2-flash-messages";

const BACKEND_URL = environment.apiUrl + "/congregations/";

@Injectable({
  providedIn: "root"
})
export class CongregationsService {
  private congregations: Congregation[] = [];
  private congregationsUpdated = new Subject<Congregation[]>();
  private warnFlashMessage = new Subject<void>();

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private http: HttpClient,
    private router: Router
  ) {}

  createCongregation(congregation: Congregation) {
    this.http
      .post<{ message: string; congregation: any }>(BACKEND_URL, congregation)
      .pipe(
        map(
          responseData =>
            <Congregation>{
              id: responseData.congregation._id,
              name: responseData.congregation.name
            }
        )
      )
      .subscribe(newCongregation => {
        this.congregations.unshift(newCongregation);
        this.congregationsUpdated.next([...this.congregations]);
        this._flashMessagesService.show("Nova congregação adicionada", {
          cssClass: "alert-success",
          timeout: 4000
        });
      });
  }

  getCongregationsServer() {
    this.http
      .get<{ message: string; congregations: any[] }>(BACKEND_URL)
      .pipe(
        map(responseData => {
          return {
            congregations: responseData.congregations.map(
              congregation =>
                <Congregation>{
                  id: congregation._id,
                  name: congregation.name
                }
            )
          };
        })
      )
      .subscribe(responseData => {
        this.congregations = responseData.congregations;

        this.congregations.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        this.congregationsUpdated.next([...this.congregations]);
      });
  }

  get Congregations() {

    return this.congregations || [];
  }

  getCongregationsUpdateListener() {
    return this.congregationsUpdated.asObservable();
  }

  deleteCongregation(id: string) {
    return this.http.delete(BACKEND_URL + id).subscribe(() => {
      this.congregations.forEach((u, index) => {
        if (u.id == id) this.congregations.splice(index, 1);
      });
      this.congregationsUpdated.next([...this.congregations]);
      this._flashMessagesService.show("Congregação removida", {
        cssClass: "alert-success",
        timeout: 4000
      });
    });
  }

  getCongregation(id: string) {
    let congregation = this.congregations.filter(u => u.id == id);
    return congregation[0];
  }

  updateCongregation(id: string, congregation: Congregation) {
    this.http.put(BACKEND_URL + id, congregation).subscribe(responseData => {
      this.congregations = this.congregations.map(u => {
        if (u.id == id) u = congregation;
        return u;
      });
      this.congregationsUpdated.next([...this.congregations]);
      this._flashMessagesService.show("Congregação atualizada", {
        cssClass: "alert-success",
        timeout: 4000
      });
    });
  }

  warnFlashMessageListener() {
    return this.warnFlashMessage.asObservable();
  }
}
