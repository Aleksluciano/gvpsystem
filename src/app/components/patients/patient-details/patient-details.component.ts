
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';


import { PatientsService } from './../patients.service';
import { Patient } from '../patient.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { Accommodation } from '../../accommodations/accommodation.model';
import { Hospital } from '../../hospitals/hospital.model';
import { HospitalsService } from '../../hospitals/hospitals.service';
import { AccommodationsService } from '../../accommodations/accommodations.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';



@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[
        style({ opacity: 0}),
        animate(500)
      ])
    ])
      ]
})
export class PatientDetailsComponent implements OnInit, OnDestroy {
  id: string;
  // patient: Patient;

  patientsSub: Subscription;

  accommodations: Accommodation[] = [];
  accommodation: Accommodation;
  accommodationsSub: Subscription;

  hospitals: Hospital[] = [];
  hospital: Hospital;
  hospitalsSub: Subscription;

  patient: Patient = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    phone: "",
    cep: "",
    state: "",
    city: "",
    neighborhood: "",
    address: "",
    numeral: null,
    complement: "",
    congregation: "",
    mobileElder1: "",
    mobileElder2: "",
    phoneElder1:  "",
    phoneElder2:  "",
    caseDescription: "",
    hospital: "",
    hospitalizationDate: null,
    medicalRelease: null,
    accommodation: "",
    infoWho: "",
  };

  config: AngularEditorConfig = {
    showToolbar: false,
    editable: false,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Digite aqui",
    translate: "no",
    uploadUrl: "http://localhost:3000/images",
    customClasses: [
      {
        name: "titleText",
        class: "titleText",
        tag: "h1"
      }
    ]
  };

  constructor(
    private patientsService: PatientsService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private hospitalsService: HospitalsService,
    private accommodationsService: AccommodationsService
  ) { }

  ngOnInit() {


      // Get id from url
      this.id = this.route.snapshot.params['id'];
      // Get client

      this.patient = this.patientsService.getPatient(this.id);

         //get Hospital
    this.hospitals = this.hospitalsService.Hospitals;

    if (this.hospitals.length <= 0) this.hospitalsService.getHospitalsServer();
    else {
      this.hospital = this.searchById(this.hospitals, this.patient.hospital);
    }

    this.hospitalsSub = this.hospitalsService
      .getHospitalsUpdateListener()
      .subscribe(hospitalsData => {
        this.hospitals = hospitalsData;
        this.hospital = this.searchById(this.hospitals, this.patient.hospital);
      });

    //get Accommodation
    this.accommodations = this.accommodationsService.Accommodations;

    if (this.accommodations.length <= 0)
      this.accommodationsService.getAccommodationsServer();
    else {
      this.accommodation = this.searchById(
        this.accommodations,
        this.patient.accommodation
      );
    }

    this.accommodationsSub = this.accommodationsService
      .getAccommodationsUpdateListener()
      .subscribe(accommodationsData => {
        this.accommodations = accommodationsData;
        this.accommodation = this.searchById(
          this.accommodations,
          this.patient.accommodation
        );
      });

      // let hospitalPromise = new Promise((resolve,reject)=>{
      //   this.hospitals = this.hospitalsService.Hospitals;
      //    resolve(this.hospitals);
      // })

      //  hospitalPromise.then((hospitals) =>{
      // this.hospital = this.searchById(hospitals, this.patient.hospital);
      //  })

      //  let accommodationPromise = new Promise((resolve,reject)=>{
      //    this.accommodations = this.accommodationsService.Accommodations;
      //    resolve(this.accommodations);
      //  })

      //  accommodationPromise.then((accommodations) =>{
      //   if (this.accommodations.length > 0)
      // this.accommodation = this.searchById(accommodations, this.patient.accommodation);
      //  })

  }

  onDeleteClick(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.dialog.open(ConfirmModalComponent, dialogConfig)
    .afterClosed().subscribe(result => {
      if(result)this.patientsService.deletePatient(this.id);
     });
  }

  ngOnDestroy(){
      // this.patientsSub.unsubscribe();
      this.accommodationsSub.unsubscribe();
      this.hospitalsSub.unsubscribe();


  }

  searchById(elements, id) {
    let el = elements.filter(c => c.id == id);
    return el[0];
  }

}
