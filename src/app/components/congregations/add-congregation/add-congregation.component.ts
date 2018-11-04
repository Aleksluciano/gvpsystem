import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Congregation } from '../congregation.model';
import { CongregationsService } from '../congregations.service';
import { Subscription } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-add-congregation',
  templateUrl: './add-congregation.component.html',
  styleUrls: ['./add-congregation.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[
        style({ opacity: 0}),
        animate(500)
      ])
    ])
      ]
})
export class AddCongregationComponent implements OnInit, OnDestroy {
  congregations: Congregation[] = [];
  congregationsSub: Subscription;
  selectedCongregation: Congregation;
  loaded: boolean = false;
  isNew: boolean = true;
  textInput = 'Criar';
  filteredName: string = '';



  @ViewChild("nameRef")
  nameRef: ElementRef;

  congregation: Congregation = {
    id: '',
    name: ''
  };


  constructor(
    private flashMessage: FlashMessagesService,
    private congregationsService: CongregationsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.congregations = this.congregationsService.Congregations;

    if (this.congregations.length <= 0)this.congregationsService.getCongregationsServer();

    this.congregationsSub = this.congregationsService
      .getCongregationsUpdateListener()
      .subscribe( congregationsData  => {
       this.congregations = congregationsData;
       this.congregations.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });


      });

  }


  onSelected(congregation: Congregation){
    this.congregation = {
      id: congregation.id,
      name: congregation.name
    }

    this.isNew = false;
    this.textInput = 'Atualizar';
    this.selectedCongregation = this.congregation;
    this.nameRef.nativeElement.focus();
  }

  onDeleteClick(id: string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.dialog.open(ConfirmModalComponent, dialogConfig)
    .afterClosed().subscribe(result => {
      if(result){
        this.congregationsService.deleteCongregation(id);
      this.nameRef.nativeElement.focus();
    }
     });

  }


  onSubmit({value, valid}: {value:Congregation, valid:boolean} ){

    if(!valid){

    }else if(this.isNew){
      this.congregationsService.createCongregation(value);


      this.congregation = {
        id: '',
        name: ''
      };

      this.selectedCongregation = {
        id: '',
        name: ''
      };



  }else{

    value.id = this.selectedCongregation.id;

    this.congregationsService.updateCongregation(value.id, value);


    this.congregation = {
      id: '',
      name: ''
    };

    this.selectedCongregation = {
      id: '',
      name: ''
    };
    this.textInput = 'Criar';
    this.isNew = true;


  }
}

  clearState( ){


    console.log(this.congregation,this.selectedCongregation);

      this.isNew = true;
      this.congregation = {
        id: '',
        name: ''

      };

      this.textInput = 'Criar';
      this.selectedCongregation = {
        id: '',
        name: ''
      };




  }

   ngOnDestroy(){

    this.congregationsSub.unsubscribe();


  }


}
