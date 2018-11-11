import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { Congregation } from "../congregation.model";
import { CongregationsService } from "../congregations.service";
import { Subscription } from "rxjs";
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ConfirmModalComponent } from "../../confirm-modal/confirm-modal.component";

@Component({
  selector: "app-add-congregation",
  templateUrl: "./add-congregation.component.html",
  styleUrls: ["./add-congregation.component.css"],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class AddCongregationComponent implements OnInit, OnDestroy {
  congregations: Congregation[] = [];
  congregationsSub: Subscription;
  loaded: boolean = false;
  isNew: boolean = true;
  textInput = "Criar";
  filteredName: string = "";

  modeView = false;

  @ViewChild("nameRef")
  nameRef: ElementRef;

  congregation: Congregation = {
    id: "",
    name: ""
  };

  constructor(
    private congregationsService: CongregationsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.congregations = this.congregationsService.Congregations;

    if (this.congregations.length <= 0)
      this.congregationsService.getCongregationsServer();

    this.congregationsSub = this.congregationsService
      .getCongregationsUpdateListener()
      .subscribe(congregationsData => {
        this.congregations = congregationsData;
      });
  }

  onSelectedToChange(congregation: Congregation) {
    this.congregation = {
      id: congregation.id,
      name: congregation.name
    };

    this.modeView = false;
    this.isNew = false;
    this.textInput = "Atualizar";
    window.scrollTo(0, 0);
  }

  onSelectedToView(congregation: Congregation) {
    this.congregation = {
      id: congregation.id,
      name: congregation.name
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
          this.congregationsService.deleteCongregation(id);
          this.backMainView();
          window.scrollTo(0, 0);
        }
      });
  }

  onSubmit({ value, valid }: { value: Congregation; valid: boolean }) {
    if (!valid) {
    } else if (this.isNew) {
      this.congregationsService.createCongregation(value);

      this.congregation = this.clearModel();
    } else {
      value.id = this.congregation.id;

      this.congregationsService.updateCongregation(value.id, value);

     this.clearState();

    }
  }

  backMainView() {
    this.modeView = false;
    this.clearState();
  }

  ngOnDestroy() {
    this.congregationsSub.unsubscribe();
  }

  clearState() {
    this.congregation = this.clearModel();
    this.isNew = true;
    this.textInput = "Criar";
  }

  clearModel() {
    let model: Congregation;
    return model = {
      id: "",
      name: ""
    }
  }
}
