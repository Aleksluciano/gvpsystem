import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Hospital } from "./hospital.model";
import { FlashMessagesService } from "angular2-flash-messages";

const BACKEND_URL = environment.apiUrl + "/hospitals/";

@Injectable({
  providedIn: "root"
})
export class HospitalsService {
  private hospitals: Hospital[] = [];
  private hospitalsUpdated = new Subject<Hospital[]>();
  private warnFlashMessage = new Subject<void>();

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private http: HttpClient,
    private router: Router
  ) {}

  createHospital(hospital: Hospital) {
    this.http
      .post<{ message: string; hospital: any }>(BACKEND_URL, hospital)
      .pipe(
        map(
          responseData =>
            <Hospital>{
              id: responseData.hospital._id,
              name: responseData.hospital.name,
              cep: responseData.hospital.cep,
              state: responseData.hospital.state,
              city: responseData.hospital.city,
              neighborhood: responseData.hospital.neighborhood,
              address: responseData.hospital.address,
              numeral: responseData.hospital.numeral,
              complement: responseData.hospital.complement
            }
        )
      )
      .subscribe(newHospital => {
        this.hospitals.unshift(newHospital);
        this.hospitalsUpdated.next([...this.hospitals]);
        this._flashMessagesService.show("Novo hospital adicionado", {
          cssClass: "alert-success",
          timeout: 2000
        });
      });
  }

  getHospitalsServer() {
    this.http
      .get<{ message: string; hospitals: any[] }>(BACKEND_URL)
      .pipe(
        map(responseData => {
          return {
            hospitals: responseData.hospitals.map(
              hospital =>
                <Hospital>{
                  id: hospital._id,
                  name: hospital.name,
                  cep: hospital.cep,
                  state: hospital.state,
                  city: hospital.city,
                  neighborhood: hospital.neighborhood,
                  address: hospital.address,
                  numeral: hospital.numeral,
                  complement: hospital.complement
                }
            )
          };
        })
      )
      .subscribe(responseData => {
        this.hospitals = responseData.hospitals;

        this.hospitals.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        this.hospitalsUpdated.next([...this.hospitals]);
      });
  }

  get Hospitals() {

    return this.hospitals || [];
  }

  getHospitalsUpdateListener() {
    return this.hospitalsUpdated.asObservable();
  }

  deleteHospital(id: string) {
    return this.http.delete(BACKEND_URL + id).subscribe(() => {
      this.hospitals.forEach((u, index) => {
        if (u.id == id) this.hospitals.splice(index, 1);
      });
      this.hospitalsUpdated.next([...this.hospitals]);
      this._flashMessagesService.show("Hospital removido", {
        cssClass: "alert-success",
        timeout: 2000
      });
    });
  }

  getHospital(id: string) {
    let hospital = this.hospitals.filter(u => u.id == id);
    return hospital[0];
  }

  updateHospital(id: string, hospital: Hospital) {
    this.http.put(BACKEND_URL + id, hospital).subscribe(responseData => {
      this.hospitals = this.hospitals.map(u => {
        if (u.id == id) u = hospital;
        return u;
      });
      this.hospitalsUpdated.next([...this.hospitals]);
      this._flashMessagesService.show("Hospital atualizado", {
        cssClass: "alert-success",
        timeout: 2000
      });
    });
  }

  warnFlashMessageListener() {
    return this.warnFlashMessage.asObservable();
  }
}
