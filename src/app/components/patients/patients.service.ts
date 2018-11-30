import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

import { Subject } from 'rxjs';
import { map } from "rxjs/operators";

import { Patient } from './patient.model';
import { FlashMessagesService } from 'angular2-flash-messages';


const BACKEND_URL = environment.apiUrl + "/patients/";

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private patients: Patient[] = [];
  private patient: Patient;
  private patientsUpdated = new Subject<Patient[]>();
  private onePatientUpdated = new Subject<Patient>();
  private warnFlashMessage = new Subject<void>();


  constructor(
    private _flashMessagesService: FlashMessagesService,
    private http: HttpClient, private router: Router) { }

  createPatient(patient: Patient) {

    this.http
      .post<{ message: string; patient: any }>(
        BACKEND_URL,
        patient
      ).pipe(
        map(responseData =>
          <Patient>{
          id: responseData.patient._id,
          firstName: responseData.patient.firstName,
          lastName: responseData.patient.lastName,
          email: responseData.patient.email,
          mobilePhone: responseData.patient.mobilePhone,
          phone: responseData.patient.phone,
          cep: responseData.patient.cep,
          state: responseData.patient.state,
          city: responseData.patient.city,
          neighborhood: responseData.patient.neighborhood,
          address: responseData.patient.address,
          numeral: responseData.patient.numeral,
          complement: responseData.patient.complement,
          congregation: responseData.patient.congregation,
          mobileElder1: responseData.patient.mobileElder1,
          mobileElder2: responseData.patient.mobileElder2,
          phoneElder1:  responseData.patient.phoneElder1,
          phoneElder2:  responseData.patient.phoneElder2,
          caseDescription: responseData.patient.caseDescription,
          hospital: responseData.patient.hospital,
          hospitalizationDate: responseData.patient.hospitalizationDate,
          medicalRelease: responseData.patient.medicalRelease,
          accommodation: responseData.patient.accommodation,
          infoWho: responseData.patient.infoWho
        }
          )

      )
      .subscribe((newPatient) => {

         this.patients.unshift(newPatient);
         this._flashMessagesService.show('Novo paciente adicionado', {
          cssClass: 'alert-success', timeout: 4000
        });
        this.patientsUpdated.next([...this.patients]);

      });
  }

  getPatientsServer() {

    this.http
      .get<{ message: string; patients: any[]}>(
        BACKEND_URL
      )
      .pipe(
        map(responseData => {
          return {
            patients: responseData.patients.map(patient =>
              <Patient>{
                id: patient._id,
                firstName: patient.firstName,
                lastName: patient.lastName,
                email: patient.email,
                mobilePhone: patient.mobilePhone,
                phone: patient.phone,
                cep: patient.cep,
                state: patient.state,
                city: patient.city,
                neighborhood: patient.neighborhood,
                address: patient.address,
                numeral: patient.numeral,
                complement: patient.complement,
                congregation: patient.congregation,
                mobileElder1: patient.mobileElder1,
                mobileElder2: patient.mobileElder2,
                phoneElder1:  patient.phoneElder1,
                phoneElder2:  patient.phoneElder2,
                caseDescription: patient.caseDescription,
                hospital: patient.hospital,
                hospitalizationDate: patient.hospitalizationDate,
                medicalRelease: patient.medicalRelease,
                accommodation: patient.accommodation,
                infoWho: patient.infoWho
              }
            )
          }
        })
      )
      .subscribe(responseData => {
        this.patients = responseData.patients;

        this.patients.sort((a, b) => {
          if (a.firstName < b.firstName ) return -1;
          if (a.firstName > b.firstName ) return 1;
          return 0;
        });

        this.patientsUpdated.next([...this.patients]);
      });
  }


  getOnePatientServer(id: string) {

    this.http
      .get<{ message: string; patient: any}>(
        BACKEND_URL + id
      )
      .pipe(
        map(responseData => {
          return <Patient>{
                id: responseData.patient._id,
                firstName: responseData.patient.firstName,
                lastName: responseData.patient.lastName,
                email: responseData.patient.email,
                mobilePhone: responseData.patient.mobilePhone,
                phone: responseData.patient.phone,
                cep: responseData.patient.cep,
                state: responseData.patient.state,
                city: responseData.patient.city,
                neighborhood: responseData.patient.neighborhood,
                address: responseData.patient.address,
                numeral: responseData.patient.numeral,
                complement: responseData.patient.complement,
                congregation: responseData.patient.congregation,
                mobileElder1: responseData.patient.mobileElder1,
                mobileElder2: responseData.patient.mobileElder2,
                phoneElder1:  responseData.patient.phoneElder1,
                phoneElder2:  responseData.patient.phoneElder2,
                caseDescription: responseData.patient.caseDescription,
                hospital: responseData.patient.hospital,
                hospitalizationDate: responseData.patient.hospitalizationDate,
                medicalRelease: responseData.patient.medicalRelease,
                accommodation: responseData.patient.accommodation,
                infoWho: responseData.patient.infoWho
              }
          }
        )
      )
      .subscribe(responseData => {
        this.patient = responseData;
          this.onePatientUpdated.next(this.patient);
      });
  }

  get Patients(){
    return this.patients || [];
  }

  getPatientsUpdateListener() {
    return this.patientsUpdated.asObservable();
  }

  getOnePatientUpdateListener() {
    return this.onePatientUpdated.asObservable();
  }


  deletePatient(id: string) {
    return this.http.delete(BACKEND_URL + id).subscribe(() =>{
      this.patients.forEach((u, index) => {
        if(u.id == id) this.patients.splice(index, 1);
      });
      this._flashMessagesService.show('Paciente removido', {
        cssClass: 'alert-success', timeout: 4000
      });
      this.patientsUpdated.next([...this.patients]);
      //this.warnFlashMessage.next();
    })
  }

  getPatient(id: string) {
    let patient = this.patients.filter(u => u.id == id);
    return patient[0];
  }

  updatePatient(id: string, patient: Patient) {
  this.http
  .put(BACKEND_URL + id, patient)
  .subscribe(responseData => {
    this.patients = this.patients.map(u => {
       if(u.id == id) u = patient;
       return u;
    });
  this._flashMessagesService.show("Paciente atualizado", {
        cssClass: "alert-success",
        timeout: 4000
      });
      this.router.navigate(['/patients']);
    // this.warnFlashMessage.next();
  });
}

warnFlashMessageListener(){
  return this.warnFlashMessage.asObservable();
}

}
