
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { Location } from "@angular/common"
import { FlashMessagesService } from "angular2-flash-messages";
import { Subscription } from 'rxjs';

import { NgxViacepService } from '@brunoc/ngx-viacep';

import { User } from "../user.model";
import { UsersService } from "../users.service";
import { Congregation } from "../../congregations/congregation.model";
import { CongregationsService } from "../../congregations/congregations.service";
import { MatDialog } from "@angular/material";
import { InfoModalComponent } from "../../info-modal/info-modal.component";
import { MaskPhones } from "../../../mask/phone-mask";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class AddUserComponent implements OnInit, OnDestroy {
  @ViewChild("userForm")
  form: any;
  @ViewChild("firstNameRef")
  firstNameRef: ElementRef;

  usersSub: Subscription;


  congregations: Congregation[] = [];
  congregationsSub: Subscription;
  congregation: Congregation = { id: "", name: ""};


  users: User[] = [];
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

  maskPhones = new MaskPhones(this.user);

  constructor(
    private flashMessage: FlashMessagesService,
    private usersService: UsersService,
    private congregationsService: CongregationsService,
    private viacep: NgxViacepService,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit() {

    this.users = this.usersService.Users;
    if (this.users.length <= 0)this.usersService.getUsersServer();

    this.usersSub = this.usersService
    .getUsersUpdateListener()
    .subscribe( ()  => {
      this.resetForm();
    });


  this.congregations = this.congregationsService.Congregations;

    if (this.congregations.length <= 0)this.congregationsService.getCongregationsServer();

    this.congregationsSub = this.congregationsService
      .getCongregationsUpdateListener()
      .subscribe( congregationsData  => {
       this.congregations = congregationsData;

      });


  }

  onSubmit({ value, valid }: { value: User; valid: boolean }) {
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
      this.usersService.createUser(value);

    }
  }

  searchCep(){
    if (!this.user.cep) return;
    this.viacep.buscarPorCep(this.user.cep).then( ( endereco) => {
      this.user.cep = endereco.cep;
      this.user.state = endereco.uf;
      this.user.city = endereco.localidade;
      this.user.neighborhood = endereco.bairro;
      this.user.address = endereco.logradouro;

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
      perfil: "Membro",
      region: "Leste",
      password: ""

    })


  }

  ngOnDestroy(){

    this.congregationsSub.unsubscribe();
    this.usersSub.unsubscribe();
  }

  onBackClicked() {
    this.location.back();
  }


}
