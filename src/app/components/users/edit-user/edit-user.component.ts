
import { MatDialog } from '@angular/material';
import { Congregation } from "./../../congregations/congregation.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { NgxViacepService } from "@brunoc/ngx-viacep";

import { User } from "../user.model";
import { UsersService } from "../users.service";
import { Subscription } from "rxjs";
import { CongregationsService } from "../../congregations/congregations.service";
import { InfoModalComponent } from "../../info-modal/info-modal.component";
import { MaskPhones } from 'src/app/mask/phone-mask';

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.css"],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class EditUserComponent implements OnInit, OnDestroy {
  id: string;
  user: User = {
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
    perfil: "Membro",
    region: "Leste",
    password: ""
  };
  userSub: Subscription;
  maskPhones: MaskPhones;

  congregations: Congregation[] = [];
  congregationsSub: Subscription;
  congregation: Congregation = { id: "", name: "" };

  constructor(
    private flashMessage: FlashMessagesService,
    private usersService: UsersService,
    private congregationsService: CongregationsService,
    private viacep: NgxViacepService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit() {
    // Get id from url
    this.id = this.route.snapshot.params["id"];
    // Get client
    let user = this.usersService.getUser(this.id);
    if (user)this.user = user;
    else{
      this.usersService.getOneUserServer(this.id);
    }

    this.userSub = this.usersService.getOneUserUpdateListener().subscribe((user) => this.user = user)


    this.maskPhones = new MaskPhones(this.user);



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
  }

  onSubmit({ value, valid }: { value: User; valid: boolean }) {
    if (!valid) {
      // Show Error
      this.flashMessage.show("Preencha o formulário corretamente", {
        cssClass: "alert-danger",
        timeout: 4000
      });
    } else {

      // Update User
      value.congregation = this.congregation.name;
      value.id = this.id;
      this.usersService.updateUser(this.id, value);
    }
  }

  searchCep() {
    if (!this.user.cep) return;
    this.viacep
      .buscarPorCep(this.user.cep)
      .then(endereco => {
        this.user.cep = endereco.cep;
        this.user.state = endereco.uf;
        this.user.city = endereco.localidade;
        this.user.neighborhood = endereco.bairro;
        this.user.address = endereco.logradouro;

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
    this.userSub.unsubscribe();
  }

  searchCongregation() {
    let congs = this.congregations.filter(
      c => c.name == this.user.congregation
    );
    return congs[0];
  }

  onBackClicked() {
    this.location.back();
  }
}
