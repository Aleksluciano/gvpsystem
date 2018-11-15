import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


import { PatientsService } from '../patients.service';
import { Patient } from '../patient.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';

//
@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ["./list-patients.component.css"],
  animations: [
    trigger('fade',[
      transition('void => *',[
        style({ opacity: 0}),
        animate(500)
      ]),
    ]),
      ]
})
export class ListPatientsComponent implements OnInit, OnDestroy {
  patientsSub: Subscription;
  patients: Patient[] = [];
  filteredName: string = '';
  filteredEmail: string = '';

  constructor(
    private patientsService: PatientsService,
    public router: Router,
    private dialog: MatDialog
    ) { }

  ngOnInit() {

     this.patients = this.patientsService.Patients;
    if (this.patients.length <= 0)this.patientsService.getPatientsServer();

    this.patientsSub = this.patientsService
      .getPatientsUpdateListener()
      .subscribe( patientsData  => {
       this.patients = patientsData

      });


  }

  ngOnDestroy(){
    this.patientsSub.unsubscribe();

  }


  onDeleteClick(id: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.dialog.open(ConfirmModalComponent, dialogConfig)
    .afterClosed().subscribe(result => {
      if(result)this.patientsService.deletePatient(id);
     });
  }

}
