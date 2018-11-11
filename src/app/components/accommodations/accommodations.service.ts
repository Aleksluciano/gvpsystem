import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Accommodation } from "./accommodation.model";
import { FlashMessagesService } from "angular2-flash-messages";

const BACKEND_URL = environment.apiUrl + "/accommodations/";

@Injectable({
  providedIn: "root"
})
export class AccommodationsService {
  private accommodations: Accommodation[] = [];
  private accommodationsUpdated = new Subject<Accommodation[]>();
  private warnFlashMessage = new Subject<void>();

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private http: HttpClient,
    private router: Router
  ) {}

  createAccommodation(accommodation: Accommodation) {
    this.http
      .post<{ message: string; accommodation: any }>(BACKEND_URL, accommodation)
      .pipe(
        map(
          responseData =>
            <Accommodation>{
              id: responseData.accommodation._id,
              name: responseData.accommodation.name,
              cep: responseData.accommodation.cep,
              state: responseData.accommodation.state,
              city: responseData.accommodation.city,
              neighborhood: responseData.accommodation.neighborhood,
              address: responseData.accommodation.address,
              numeral: responseData.accommodation.numeral,
              complement: responseData.accommodation.complement,
              responsable: responseData.accommodation.responsable,
              mobilePhone: responseData.accommodation.mobilePhone,
              phone: responseData.accommodation.phone
            }
        )
      )
      .subscribe(newAccommodation => {
        this.accommodations.unshift(newAccommodation);
        this.accommodationsUpdated.next([...this.accommodations]);
        this._flashMessagesService.show("Nova hospedagem adicionada", {
          cssClass: "alert-success",
          timeout: 2000
        });
      });
  }

  getAccommodationsServer() {
    this.http
      .get<{ message: string; accommodations: any[] }>(BACKEND_URL)
      .pipe(
        map(responseData => {
          return {
            accommodations: responseData.accommodations.map(
              accommodation =>
                <Accommodation>{
                  id: accommodation._id,
                  name: accommodation.name,
                  cep: accommodation.cep,
                  state: accommodation.state,
                  city: accommodation.city,
                  neighborhood: accommodation.neighborhood,
                  address: accommodation.address,
                  numeral: accommodation.numeral,
                  complement: accommodation.complement,
                  responsable: accommodation.responsable,
                  mobilePhone: accommodation.mobilePhone,
                  phone: accommodation.phone
                }
            )
          };
        })
      )
      .subscribe(responseData => {
        this.accommodations = responseData.accommodations;

        this.accommodations.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        this.accommodationsUpdated.next([...this.accommodations]);
      });
  }

  get Accommodations() {
    return this.accommodations || [];
  }

  getAccommodationsUpdateListener() {
    return this.accommodationsUpdated.asObservable();
  }

  deleteAccommodation(id: string) {
    return this.http.delete(BACKEND_URL + id).subscribe(() => {
      this.accommodations.forEach((u, index) => {
        if (u.id == id) this.accommodations.splice(index, 1);
      });
      this.accommodationsUpdated.next([...this.accommodations]);
      this._flashMessagesService.show("Hospedagem removida", {
        cssClass: "alert-success",
        timeout: 2000
      });
    });
  }

  getAccommodation(id: string) {
    let accommodation = this.accommodations.filter(u => u.id == id);
    return accommodation[0];
  }

  updateAccommodation(id: string, accommodation: Accommodation) {
    this.http.put(BACKEND_URL + id, accommodation).subscribe(responseData => {
      this.accommodations = this.accommodations.map(u => {
        if (u.id == id) u = accommodation;
        return u;
      });
      this.accommodationsUpdated.next([...this.accommodations]);
      this._flashMessagesService.show("Hospedagem atualizada", {
        cssClass: "alert-success",
        timeout: 2000
      });
    });
  }

  warnFlashMessageListener() {
    return this.warnFlashMessage.asObservable();
  }
}
