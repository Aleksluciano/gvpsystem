import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { Accommodation } from "../accommodation.model";
import { AccommodationsService } from "../accommodations.service";
import { Subscription } from "rxjs";
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ConfirmModalComponent } from "../../confirm-modal/confirm-modal.component";
import { InfoModalComponent } from "../../info-modal/info-modal.component";
import { NgxViacepService } from "@brunoc/ngx-viacep";
import { MaskPhones } from './../../../mask/phone-mask';

@Component({
  selector: "app-add-accommodation",
  templateUrl: "./add-accommodation.component.html",
  styleUrls: ["./add-accommodation.component.css"],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class AddAccommodationComponent implements OnInit, OnDestroy {
  accommodations: Accommodation[] = [];
  accommodationsSub: Subscription;
  loaded: boolean = false;
  isNew: boolean = true;
  textInput = "Criar";
  filteredName: string = "";
  maskPhones: MaskPhones;


  modeView = false;

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

  constructor(
    private accommodationsService: AccommodationsService,
    private dialog: MatDialog,
    private viacep: NgxViacepService
  ) {}

  ngOnInit() {
    this.accommodation = this.clearModel();

    this.accommodations = this.accommodationsService.Accommodations;

    this.maskPhones = new MaskPhones(this.accommodation);

    if (this.accommodations.length <= 0)
      this.accommodationsService.getAccommodationsServer();

    this.accommodationsSub = this.accommodationsService
      .getAccommodationsUpdateListener()
      .subscribe(accommodationsData => {
        this.accommodations = accommodationsData;
      });
  }

  onSelectedToChange(accommodation: Accommodation) {
    this.accommodation = {
      id: accommodation.id,
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
    };

    this.maskPhones = new MaskPhones(this.accommodation);

    this.modeView = false;
    this.isNew = false;
    this.textInput = "Atualizar";

    window.scrollTo(0, 0);
  }

  onSelectedToView(accommodation: Accommodation) {
    this.accommodation = {
      id: accommodation.id,
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
          this.accommodationsService.deleteAccommodation(id);
          this.backMainView();
          window.scrollTo(0, 0);
        }
      });
  }

  onSubmit({ value, valid }: { value: Accommodation; valid: boolean }) {

    if (!valid) {
    } else if (this.isNew) {
      this.accommodationsService.createAccommodation(value);

      this.accommodation = this.clearModel();
    } else {
      value.id = this.accommodation.id;
      this.accommodationsService.updateAccommodation(value.id, value);

      this.clearState();

    }
  }


  searchCep() {
    if (!this.accommodation.cep) return;
    this.viacep
      .buscarPorCep(this.accommodation.cep)
      .then(endereco => {
        this.accommodation.cep = endereco.cep;
        this.accommodation.state = endereco.uf;
        this.accommodation.city = endereco.localidade;
        this.accommodation.neighborhood = endereco.bairro;
        this.accommodation.address = endereco.logradouro;

      })
      .catch(error => {
        // Alguma coisa deu errado :/
        this.dialog.open(InfoModalComponent, {
          data: { title: "Erro", message: error.message }
        });

      });
  }

  ngOnDestroy() {
    this.accommodationsSub.unsubscribe();
  }

  backMainView() {
    this.modeView = false;
    this.clearState();

  }

  clearModel() {
    let model: Accommodation;
    return model = {
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
  }


  clearState() {
    this.accommodation = this.clearModel();
    this.isNew = true;
    this.textInput = "Criar";
  }

}
