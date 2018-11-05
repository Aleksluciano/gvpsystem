import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


import { UsersService } from '../users.service';
import { User } from '../user.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';

//
@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ["./list-users.component.css"],
  animations: [
    trigger('fade',[
      transition('void => *',[
        style({ opacity: 0}),
        animate(500)
      ]),
    ]),
      ]
})
export class ListUsersComponent implements OnInit, OnDestroy {
  usersSub: Subscription;
  users: User[] = [];
  filteredName: string = '';
  filteredEmail: string = '';

  constructor(
    private usersService: UsersService,
    public router: Router,
    private dialog: MatDialog
    ) { }

  ngOnInit() {

     this.users = this.usersService.Users;
    if (this.users.length <= 0)this.usersService.getUsersServer();

    this.usersSub = this.usersService
      .getUsersUpdateListener()
      .subscribe( usersData  => {
       this.users = usersData
 
      });


  }

  ngOnDestroy(){
    this.usersSub.unsubscribe();

  }


  onDeleteClick(id: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.dialog.open(ConfirmModalComponent, dialogConfig)
    .afterClosed().subscribe(result => {
      if(result)this.usersService.deleteUser(id);
     });
  }

}
