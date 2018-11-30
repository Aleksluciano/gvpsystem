import { MatDialog } from "@angular/material";
import { Congregation } from "./../../congregations/congregation.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { NgxViacepService } from "@brunoc/ngx-viacep";
import { AngularEditorConfig } from "@kolkov/angular-editor";

import { Patient } from "../patient.model";
import { PatientsService } from "../patients.service";
import { Subscription } from "rxjs";
import { CongregationsService } from "../../congregations/congregations.service";
import { InfoModalComponent } from "../../info-modal/info-modal.component";
import { MaskPhones } from "src/app/mask/phone-mask";
import { Hospital } from "../../hospitals/hospital.model";
import { Accommodation } from "../../accommodations/accommodation.model";
import { HospitalsService } from "../../hospitals/hospitals.service";
import { AccommodationsService } from "../../accommodations/accommodations.service";

@Component({
  selector: "app-edit-patient",
  templateUrl: "./edit-patient.component.html",
  styleUrls: ["./edit-patient.component.css"],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class EditPatientComponent implements OnInit, OnDestroy {
  id: string;
  patientSub: Subscription;
  maskPhones: MaskPhones;

  congregations: Congregation[] = [];
  congregationsSub: Subscription;
  congregation: Congregation = { id: "", name: "" };

  accommodations: Accommodation[] = [];
  accommodationsSub: Subscription;
  accommodation: Accommodation;

  hospitals: Hospital[] = [];
  hospitalsSub: Subscription;
  hospital: Hospital;

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
    editable: true,
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
    private flashMessage: FlashMessagesService,
    private patientsService: PatientsService,
    private congregationsService: CongregationsService,
    private viacep: NgxViacepService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private hospitalsService: HospitalsService,
    private accommodationsService: AccommodationsService,
    private location: Location
  ) {}

  ngOnInit() {
    // Get id from url
    this.id = this.route.snapshot.params["id"];
    // Get client

    let patient = this.patientsService.getPatient(this.id);
    if (patient)this.patient = patient;
    else{
      this.patientsService.getOnePatientServer(this.id);
    }

    this.patientSub = this.patientsService.getOnePatientUpdateListener().subscribe((patient) => this.patient = patient)


    this.maskPhones = new MaskPhones(this.patient);



    this.congregations = this.congregationsService.Congregations;

    if (this.congregations.length <= 0)
      this.congregationsService.getCongregationsServer();
    else {
      this.congregation = this.searchCongregation();
    }

    this.congregationsSub = this.congregationsService
      .getCongregationsUpdateListener()
      .subscribe(congregationsData => {
        this.congregations = congregationsData;

        this.congregation = this.searchCongregation();
      });

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
  }

  onSubmit({ value, valid }: { value: Patient; valid: boolean }) {
    if (!valid) {
      // Show Error
      this.flashMessage.show("Preencha o formulário corretamente", {
        cssClass: "alert-danger",
        timeout: 4000
      });
    } else {

      // Update Patient
      value.congregation = this.congregation.name;
      value.accommodation = this.accommodation.id;
      value.hospital = this.hospital.id;
      value.id = this.id;
      this.patientsService.updatePatient(this.id, value);
    }
  }

  searchCep() {
    if (!this.patient.cep) return;
    this.viacep
      .buscarPorCep(this.patient.cep)
      .then(endereco => {
        this.patient.cep = endereco.cep;
        this.patient.state = endereco.uf;
        this.patient.city = endereco.localidade;
        this.patient.neighborhood = endereco.bairro;
        this.patient.address = endereco.logradouro;

      })
      .catch(error => {
        // Alguma coisa deu errado :/

        this.dialog.open(InfoModalComponent, {
          data: { title: "Erro", message: error.message }
        });
      });
  }

  ngOnDestroy() {
    this.congregationsSub.unsubscribe();
    this.hospitalsSub.unsubscribe();
    this.accommodationsSub.unsubscribe();
    this.patientSub.unsubscribe();
  }

  searchCongregation() {
    let congs = this.congregations.filter(
      c => c.name == this.patient.congregation
    );
    return congs[0];
  }

  searchById(elements, id) {
    let el = elements.filter(c => c.id == id);
    return el[0];
  }

  onBackClicked() {
    this.location.back();
  }
}
