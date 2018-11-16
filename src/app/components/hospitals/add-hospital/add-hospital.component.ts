import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { Hospital } from "../hospital.model";
import { HospitalsService } from "../hospitals.service";
import { Subscription } from "rxjs";
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ConfirmModalComponent } from "../../confirm-modal/confirm-modal.component";
import { InfoModalComponent } from "../../info-modal/info-modal.component";
import { NgxViacepService } from "@brunoc/ngx-viacep";

@Component({
  selector: "app-add-hospital",
  templateUrl: "./add-hospital.component.html",
  styleUrls: ["./add-hospital.component.css"],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class AddHospitalComponent implements OnInit, OnDestroy {
  hospitals: Hospital[] = [];
  hospitalsSub: Subscription;
  loaded: boolean = false;
  isNew: boolean = true;
  textInput = "Criar";
  filteredName: string = "";

  modeView = false;

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

  constructor(
    private hospitalsService: HospitalsService,
    private dialog: MatDialog,
    private viacep: NgxViacepService
  ) {}

  ngOnInit() {
    this.hospitals = this.hospitalsService.Hospitals;

    if (this.hospitals.length <= 0) this.hospitalsService.getHospitalsServer();

    this.hospitalsSub = this.hospitalsService
      .getHospitalsUpdateListener()
      .subscribe(hospitalsData => {
        this.hospitals = hospitalsData;
      });
  }

  onSelectedToChange(hospital: Hospital) {
    this.hospital = {
      id: hospital.id,
      name: hospital.name,
      cep: hospital.cep,
      state: hospital.state,
      city: hospital.city,
      neighborhood: hospital.neighborhood,
      address: hospital.address,
      numeral: hospital.numeral,
      complement: hospital.complement
    };

    this.modeView = false;
    this.isNew = false;
    this.textInput = "Atualizar";
    window.scrollTo(0, 0);
  }

  onSelectedToView(hospital: Hospital) {
    this.hospital = {
      id: hospital.id,
      name: hospital.name,
      cep: hospital.cep,
      state: hospital.state,
      city: hospital.city,
      neighborhood: hospital.neighborhood,
      address: hospital.address,
      numeral: hospital.numeral,
      complement: hospital.complement
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
          this.hospitalsService.deleteHospital(id);
          this.backMainView();
          window.scrollTo(0, 0);
        }
      });
  }

  onSubmit({ value, valid }: { value: Hospital; valid: boolean }) {
    if (!valid) {
    } else if (this.isNew) {
      this.hospitalsService.createHospital(value);
      this.hospital = this.clearModel();
    } else {
      value.id = this.hospital.id;

      this.hospitalsService.updateHospital(value.id, value);

      this.clearState();

    }
  }


  searchCep() {
    if (!this.hospital.cep) return;
    this.viacep
      .buscarPorCep(this.hospital.cep)
      .then(endereco => {
        this.hospital.cep = endereco.cep;
        this.hospital.state = endereco.uf;
        this.hospital.city = endereco.localidade;
        this.hospital.neighborhood = endereco.bairro;
        this.hospital.address = endereco.logradouro;

      })
      .catch(error => {
        // Alguma coisa deu errado :/
        this.dialog.open(InfoModalComponent, {
          data: { title: "Erro", message: error.message }
        });

      });
  }

  ngOnDestroy() {
    this.hospitalsSub.unsubscribe();
  }

  backMainView() {
    this.clearState();
    this.modeView = false;
  }


  clearState() {
    this.hospital = this.clearModel();
    this.isNew = true;
    this.textInput = "Criar";
  }

  clearModel() {
    let model: Hospital;
    return model = {
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
