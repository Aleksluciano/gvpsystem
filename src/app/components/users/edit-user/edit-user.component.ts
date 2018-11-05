import { MatDialog } from '@angular/material';
import { Congregation } from "./../../congregations/congregation.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router, ActivatedRoute } from "@angular/router";

import { NgxViacepService } from "@brunoc/ngx-viacep";

import { User } from "../user.model";
import { UsersService } from "../users.service";
import { Subscription } from "rxjs";
import { CongregationsService } from "../../congregations/congregations.service";
import { InfoModalComponent } from "gvpsystem/src/app/components/info-modal/info-modal.component";

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
  user: User;

  congregations: Congregation[] = [];
  congregationsSub: Subscription;
  congregation: Congregation = { id: "", name: "" };

  constructor(
    private flashMessage: FlashMessagesService,
    private usersService: UsersService,
    private congregationsService: CongregationsService,
    private viacep: NgxViacepService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Get id from url
    this.id = this.route.snapshot.params["id"];
    // Get client
    this.user = this.usersService.getUser(this.id);

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
      console.log(value);
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

  ngOnDestroy() {
    this.congregationsSub.unsubscribe();
  }

  searchCongregation() {
    let congs = this.congregations.filter(
      c => c.name == this.user.congregation
    );
    return congs[0];
  }
}
