import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { FlashMessagesService } from "angular2-flash-messages";
import { Subscription } from 'rxjs';

import { NgxViacepService } from '@brunoc/ngx-viacep';

import { User } from "../user.model";
import { UsersService } from "../users.service";
import { Congregation } from "../../congregations/congregation.model";
import { CongregationsService } from "../../congregations/congregations.service";
import { MatDialog } from "@angular/material";
import { InfoModalComponent } from "gvpsystem/src/app/components/info-modal/info-modal.component";

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

  constructor(
    private flashMessage: FlashMessagesService,
    private usersService: UsersService,
    private congregationsService: CongregationsService,
    private viacep: NgxViacepService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {


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
      this.firstNameRef.nativeElement.focus();
    } else {
      console.log(value);
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
      console.log(endereco);
     }).catch( (error ) => {
      // Alguma coisa deu errado :/
      console.log(error.message);
      this.dialog.open(InfoModalComponent, {
        data: { title: "Erro", message: error.message }
      });


     });

  }

  onKeyPressMobilePhone(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (
      (event.keyCode != 8 && !pattern.test(inputChar)) ||
      event.keyCode == 32
    ) {
      event.preventDefault();
    }

    let substr = this.user.mobilePhone.substring(0, 1);
    let oldString = this.user.mobilePhone;
    let lengthString = this.user.mobilePhone.length;

    if (substr == "(" && lengthString == 3)
      this.user.mobilePhone = oldString + ") ";
    else if (substr != "(" && lengthString == 2) {
      this.user.mobilePhone = "(" + oldString + ") ";
    }

    if (lengthString == 10) {
      this.user.mobilePhone = this.user.mobilePhone + "-";
    }
  }

  onKeyPressPhone(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (
      (event.keyCode != 8 && !pattern.test(inputChar)) ||
      event.keyCode == 32
    ) {
      event.preventDefault();
    }

    let substr = this.user.phone.substring(0, 1);
    let oldString = this.user.phone;
    let lengthString = this.user.phone.length;

    if (substr == "(" && lengthString == 3) this.user.phone = oldString + ") ";
    else if (substr != "(" && lengthString == 2) {
      this.user.phone = "(" + oldString + ") ";
    }

    if (lengthString == 9) {
      this.user.phone = this.user.phone + "-";
    }


  }

  resetForm(){
    this.firstNameRef.nativeElement.focus();
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


}
