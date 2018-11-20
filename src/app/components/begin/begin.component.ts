import { Component, OnInit } from '@angular/core';
import { BeginService } from '../begin/begin.service';
import { Begin } from './begin.model';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { UsersService } from '../users/users.service';
import { PatientsService } from '../patients/patients.service';

@Component({
  selector: 'app-begin',
  templateUrl: './begin.component.html',
  styleUrls: ['./begin.component.css'],
  animations: [
    trigger("fade", [
      transition("void => *", [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class BeginComponent implements OnInit {

  objectsSub: Subscription;

  totalObjects: Begin = {
    countUser: 0,
    countPatient: 0,
    countReport: 0
  }

  constructor(
    private beginService: BeginService,
    private usersService: UsersService,
    private patientsService: PatientsService
    ) { }

  ngOnInit() {
    this.totalObjects = this.beginService.TotalObjects;

    if(this.usersService.Users.length > 0 ){
      this.totalObjects.countUser = this.usersService.Users.length;
    }

    if(this.patientsService.Patients.length > 0 ){
    this.totalObjects.countPatient = this.patientsService.Patients.length;
    }

    if (this.totalObjects.countUser == 0) {
      this.beginService.countObjectsServer();
    }

    this.objectsSub = this.beginService
      .getCountListener()
      .subscribe(objectsData => {
        this.totalObjects = objectsData;
      });
  }

  ngOnDestroy() {
    this.objectsSub.unsubscribe();
  }

  }


