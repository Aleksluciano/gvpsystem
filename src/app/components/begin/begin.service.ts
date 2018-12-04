import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Begin } from "./begin.model";


const BACKEND_URL = environment.apiUrl + "/begin";

@Injectable({
  providedIn: "root"
})
export class BeginService {
  private objectsCounted = new Subject<Begin>();
  totalObjects: Begin = {
    countUser: 0,
    countPatient: 0,
    countReport: 0
  }

  constructor(
    private http: HttpClient
  ) {}

  getCountListener() {
    return this.objectsCounted.asObservable();
  }

  countObjectsServer() {

    this.http
      .get<{countData: Begin}>(
        BACKEND_URL
      )
      .pipe(
        map(
        responseData =>
        <Begin>{
          countUser: responseData.countData.countUser,
          countPatient: responseData.countData.countPatient,
          countReport: responseData.countData.countReport,
        }
      ))
      .subscribe((countData: Begin) => {
        this.totalObjects = countData;
        this.objectsCounted.next(this.totalObjects);
      });
  }

  get TotalObjects() {

    return this.totalObjects || null;
  }




}
