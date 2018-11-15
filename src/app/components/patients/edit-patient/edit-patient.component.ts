
import { MatDialog } from '@angular/material';
import { Congregation } from "./../../congregations/congregation.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router, ActivatedRoute } from "@angular/router";

import { NgxViacepService } from "@brunoc/ngx-viacep";
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { Patient } from "../patient.model";
import { PatientsService } from "../patients.service";
import { Subscription } from "rxjs";
import { CongregationsService } from "../../congregations/congregations.service";
import { InfoModalComponent } from "../../info-modal/info-modal.component";
import { MaskPhones } from 'src/app/mask/phone-mask';
import { Hospital } from '../../hospitals/hospital.model';
import { Accommodation } from '../../accommodations/accommodation.model';
import { HospitalsService } from '../../hospitals/hospitals.service';
import { AccommodationsService } from '../../accommodations/accommodations.service';

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
  patient: Patient;
  maskPhones: MaskPhones;


  congregations: Congregation[] = [];
  congregationsSub: Subscription;
  congregation: Congregation = { id: "", name: ""};

  accommodations: Accommodation[] = [];
  accommodationsSub: Subscription;
  accommodation: Accommodation;


  hospitals: Hospital[] = [];
  hospitalsSub: Subscription;
  hospital: Hospital;



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
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private hospitalsService: HospitalsService,
    private accommodationsService: AccommodationsService,
  ) {}

  ngOnInit() {
    // Get id from url
    this.id = this.route.snapshot.params["id"];
    // Get client
    this.patient = this.patientsService.getPatient(this.id);
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

if (this.hospitals.length <= 0)
  this.hospitalsService.getHospitalsServer();


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
    } else {
      console.log(value);
      // Update Patient
      value.congregation = this.congregation.name;
      value.accommodation = this.congregation.id;
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
        console.log(endereco);
      })
      .catch(error => {
        // Alguma coisa deu errado :/
        console.log(error.message);
        this.dialog.open(InfoModalComponent, {
          data: { title: "Erro", message: error.message }
        });

      });
  }


  ngOnDestroy() {
    this.congregationsSub.unsubscribe();
    this.hospitalsSub.unsubscribe();
    this.accommodationsSub.unsubscribe();
  }

  searchCongregation() {
    let congs = this.congregations.filter(
      c => c.name == this.patient.congregation
    );
    return congs[0];
  }
}
