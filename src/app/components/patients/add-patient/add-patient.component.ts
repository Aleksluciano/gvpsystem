
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostBinding } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { FlashMessagesService } from "angular2-flash-messages";
import { Subscription } from 'rxjs';
import { Location } from "@angular/common";

import { NgxViacepService } from '@brunoc/ngx-viacep';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { Patient } from "../patient.model";
import { PatientsService } from "../patients.service";
import { Congregation } from "../../congregations/congregation.model";
import { CongregationsService } from "../../congregations/congregations.service";
import { MatDialog } from "@angular/material";
import { InfoModalComponent } from "../../info-modal/info-modal.component";
import { MaskPhones } from "../../../mask/phone-mask";
import { Accommodation } from "../../accommodations/accommodation.model";
import { Hospital } from "../../hospitals/hospital.model";
import { HospitalsService } from "../../hospitals/hospitals.service";
import { AccommodationsService } from "../../accommodations/accommodations.service";




@Component({
  selector: "app-add-patient",
  templateUrl: "./add-patient.component.html",
  styleUrls: ["./add-patient.component.css"],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class AddPatientComponent implements OnInit, OnDestroy {
  @ViewChild("patientForm")
  form: any;
  @ViewChild("firstNameRef")
  firstNameRef: ElementRef;

  congregations: Congregation[] = [];
  congregationsSub: Subscription;
  congregation: Congregation = { id: "", name: ""};

  accommodations: Accommodation[] = [];
  accommodationsSub: Subscription;
  accommodation: Accommodation = {
    id: "",
    name: "",
    cep: "",
    state: "",
    city: "",
    neighborhood: "",
    address: "",
    numeral: null,
    complement: "",
    responsable: "",
    mobilePhone: "",
    phone: ""
  };

  hospitals: Hospital[] = [];
  hospitalsSub: Subscription;
  hospital: Hospital = {
    id: "",
    name: "",
    cep: "",
    state: "",
    city: "",
    neighborhood: "",
    address: "",
    numeral: null,
    complement: ""
  };

  patients: Patient[] = [];
  patientsSub: Subscription;
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
    infoWho: "Gvp",
  };

  maskPhones = new MaskPhones(this.patient);



  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Digite aqui',
    translate: 'no',
    uploadUrl: 'http://localhost:3000/images',
    customClasses: [
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }

  constructor(
    private flashMessage: FlashMessagesService,
    private patientsService: PatientsService,
    private congregationsService: CongregationsService,
    private viacep: NgxViacepService,
    private dialog: MatDialog,
    private hospitalsService: HospitalsService,
    private accommodationsService: AccommodationsService,
    private location: Location
  ) {}

  ngOnInit() {

    this.patients = this.patientsService.Patients;
    if (this.patients.length <= 0)this.patientsService.getPatientsServer();

    this.patientsSub = this.patientsService
    .getPatientsUpdateListener()
    .subscribe( ()  => {
      this.resetForm();
    });

//get Congregation
  this.congregations = this.congregationsService.Congregations;

    if (this.congregations.length <= 0)this.congregationsService.getCongregationsServer();

    this.congregationsSub = this.congregationsService
      .getCongregationsUpdateListener()
      .subscribe( congregationsData  => {
       this.congregations = congregationsData;

      });

//get Hospital
this.hospitals = this.hospitalsService.Hospitals;

if (this.hospitals.length <= 0) this.hospitalsService.getHospitalsServer();

this.hospitalsSub = this.hospitalsService
  .getHospitalsUpdateListener()
  .subscribe(hospitalsData => {
    this.hospitals = hospitalsData;
  });

//get Accommodation
   this.accommodations = this.accommodationsService.Accommodations;

    if (this.accommodations.length <= 0)
      this.accommodationsService.getAccommodationsServer();

    this.accommodationsSub = this.accommodationsService
      .getAccommodationsUpdateListener()
      .subscribe(accommodationsData => {
        this.accommodations = accommodationsData;
      });
  }

  onSubmit({ value, valid }: { value: Patient; valid: boolean }) {
    if (!valid) {
      // Show Error
      this.flashMessage.show("Preencha o formulário corretamente", {
        cssClass: "alert-danger",
        timeout: 4000
      });
      window.scrollTo(0, 0);
    } else {

      // Add new client
      value.congregation = this.congregation.name;
      value.accommodation = this.accommodation.id;
      value.hospital = this.hospital.id;

      this.patientsService.createPatient(value);

    }
  }

  searchCep(){
    if (!this.patient.cep) return;
    this.viacep.buscarPorCep(this.patient.cep).then( ( endereco) => {
      this.patient.cep = endereco.cep;
      this.patient.state = endereco.uf;
      this.patient.city = endereco.localidade;
      this.patient.neighborhood = endereco.bairro;
      this.patient.address = endereco.logradouro;

     }).catch( (error ) => {
      //outro teste

      this.dialog.open(InfoModalComponent, {
        data: { title: "Erro", message: error.message }
      });


     });

  }


  resetForm(){
    window.scrollTo(0, 0);
    this.form.resetForm();

    //Reset form and focus
    this.form.setValue({
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
      infoWho: "Gvp",

    })


  }

  ngOnDestroy(){

    this.congregationsSub.unsubscribe();
    this.patientsSub.unsubscribe();
    this.hospitalsSub.unsubscribe();
    this.accommodationsSub.unsubscribe();
  }



  onBackClicked() {
    this.location.back();
  }


}
