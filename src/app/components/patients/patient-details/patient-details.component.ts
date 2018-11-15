
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';


import { PatientsService } from './../patients.service';
import { Patient } from '../patient.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';



@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[
        style({ opacity: 0}),
        animate(500)
      ])
    ])
      ]
})
export class PatientDetailsComponent implements OnInit, OnDestroy {
  id: string;
  patient: Patient;

  patientsSub: Subscription;

  constructor(
    private patientsService: PatientsService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

      // Get id from url
      this.id = this.route.snapshot.params['id'];
      // Get client
      this.patient = this.patientsService.getPatient(this.id);

      this.patientsSub = this.patientsService
      .getPatientsUpdateListener()
      .subscribe( ()  => {
        this.router.navigate(["/"]);
      });


  }

  onDeleteClick(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.dialog.open(ConfirmModalComponent, dialogConfig)
    .afterClosed().subscribe(result => {
      if(result)this.patientsService.deletePatient(this.id);
     });
  }

  ngOnDestroy(){
      this.patientsSub.unsubscribe();

  }


}
