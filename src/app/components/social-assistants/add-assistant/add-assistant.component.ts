

import {
  Component,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { Assistant } from "../assistant.model";
import { AssistantsService } from "../assistants.service";
import { Subscription } from "rxjs";
import { MatDialogConfig, MatDialog } from "@angular/material";

import { ConfirmModalComponent } from "../../confirm-modal/confirm-modal.component";
import { MaskPhones } from './../../../mask/phone-mask';
import { Hospital } from './../../hospitals/hospital.model';
import { HospitalsService } from './../../hospitals/hospitals.service';

@Component({
  selector: "app-add-assistant",
  templateUrl: "./add-assistant.component.html",
  styleUrls: ["./add-assistant.component.css"],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class AddAssistantComponent implements OnInit, OnDestroy {
  assistants: Assistant[] = [];
  assistantsSub: Subscription;
  hospitalsSub: Subscription;

  loaded: boolean = false;
  isNew: boolean = true;
  textInput = "Criar";
  filteredName: string = "";
  maskPhones: MaskPhones;

  hospitals: Hospital[] = [];
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

  modeView = false;

  assistant: Assistant = {
    id: "",
    name: "",
    hospitals: [],
    mobilePhone: "",
    phone: ""
  };



  constructor(
    private assistantsService: AssistantsService,
    private dialog: MatDialog,
    private hospitalsService: HospitalsService
  ) {}

  ngOnInit() {

    this.assistant = this.clearModel();
    this.maskPhones = new MaskPhones(this.assistant);
    this.assistants = this.assistantsService.Assistants;

    if (this.assistants.length <= 0)
      this.assistantsService.getAssistantsServer();

    this.assistantsSub = this.assistantsService
      .getAssistantsUpdateListener()
      .subscribe(assistantsData => {
        this.assistants = assistantsData;
      });


      this.hospitals = this.hospitalsService.Hospitals;

      if (this.hospitals.length <= 0) this.hospitalsService.getHospitalsServer();

      this.hospitalsSub = this.hospitalsService
        .getHospitalsUpdateListener()
        .subscribe(hospitalsData => {
          this.hospitals = hospitalsData;

        });
  }

  onSelectedToChange(assistant: Assistant) {
    this.assistant = {
      id: assistant.id,
      name: assistant.name,
      hospitals: [...assistant.hospitals],
      mobilePhone: assistant.mobilePhone,
      phone: assistant.phone
    };

    this.modeView = false;
    this.isNew = false;
    this.textInput = "Atualizar";

    window.scrollTo(0, 0);
  }

  onSelectedToView(assistant: Assistant) {
    this.assistant = {
      id: assistant.id,
      name: assistant.name,
      hospitals: assistant.hospitals,
      mobilePhone: assistant.mobilePhone,
      phone: assistant.phone
    };

    this.modeView = true;

    window.scrollTo(0, 0);
  }

  onDeleteClick(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.assistantsService.deleteAssistant(id);
          this.backMainView();
          window.scrollTo(0, 0);
        }
      });
  }

  onSubmit({ value, valid }: { value: Assistant; valid: boolean }) {

    if (!valid) {
    } else if (this.isNew) {

      value.hospitals = this.assistant.hospitals;
      this.assistantsService.createAssistant(value);
      this.hospital = {
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
      this.assistant = this.clearModel();
    } else {
      value.id = this.assistant.id;
      value.hospitals = this.assistant.hospitals
      this.hospital = {
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
      this.assistantsService.updateAssistant(value.id, value);

      this.clearState();

    }
  }



  ngOnDestroy() {
    this.assistantsSub.unsubscribe();
  }

  backMainView() {
    this.modeView = false;
    this.clearState();

  }

  clearModel() {
    let model: Assistant;
    return model = {
      id: "",
      name: "",
      hospitals: [],
      mobilePhone: "",
      phone: ""
    };
  }


  clearState() {
    this.assistant = this.clearModel();
    this.isNew = true;
    this.textInput = "Criar";
  }

addHospital(hospital: string){

  if(hospital != "" && hospital ){
  if(!this.assistant.hospitals.includes(hospital))
  this.assistant.hospitals.push(hospital);
  this.hospital = {
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
  }
}

removeHospital(hospital: string){

  this.assistant.hospitals.splice(this.assistant.hospitals.indexOf(hospital),1);

}



}
