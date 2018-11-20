
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";

import { UsersService } from './../users.service';
import { User } from '../user.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';



@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[
        style({ opacity: 0}),
        animate(500)
      ])
    ])
      ]
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  id: string;
  user: User;

  usersSub: Subscription;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location
  ) { }

  ngOnInit() {

      // Get id from url
      this.id = this.route.snapshot.params['id'];
      // Get client
      this.user = this.usersService.getUser(this.id);

      this.usersSub = this.usersService
      .getUsersUpdateListener()
      .subscribe( ()  => {
        this.router.navigate(["/users"]);
      });


  }

  onDeleteClick(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.dialog.open(ConfirmModalComponent, dialogConfig)
    .afterClosed().subscribe(result => {
      if(result)this.usersService.deleteUser(this.id);
     });
  }

  ngOnDestroy(){
      this.usersSub.unsubscribe();

  }

  onBackClicked() {
    this.location.back();
  }

}
