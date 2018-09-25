import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-rest',
  templateUrl: './rest.component.html',
  styleUrls: ['./rest.component.css'],
  providers: [UserService]
})
export class RestComponent implements AfterViewInit {
  users: User[];

  @Input() selectedUser: User;

  @ViewChild('name') name: ElementRef;
  @ViewChild('password') password: ElementRef;
  @ViewChild('profession') profession: ElementRef;

  newUser: User = {
    name: '',
    password: '',
    profession: '',
    status: ''
  };

  constructor(private userService: UserService) { }

  ngAfterViewInit() {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().then((users: User[]) => {
      this.users = users;
    }).catch((err) => {
      this.handleError(err);
    });
  }

  selectUser(user: User): void {
    this.userService.getUserById(user._id).then(() => {
      this.selectedUser = user;
    }).catch((err) => {
      this.handleError(err);
    });
  }

  createUser() {
    this.userService.createUser(this.newUser).then(() => {
      this.users.push(this.newUser);
    }).catch((err) => {
      this.handleError(err);
    });
  }

  deleteUser(selectedUser: User) {
    this.userService.deleteUser(selectedUser._id).then(() => {
      var index = this.users.findIndex(x => x._id === selectedUser._id);
      this.users.splice(index, 1);
      this.selectedUser = null;
    }).catch((err) => {
      this.handleError(err);
    });
  }

  updateUser(selectedUser: User) {
    this.selectedUser.name = this.name.nativeElement.value;
    this.selectedUser.password = this.password.nativeElement.value;
    this.selectedUser.profession = this.profession.nativeElement.value;

    this.userService.updateUser(this.selectedUser).then((result) => {
    });
  }

  private handleError(error: any) {
    console.error('An error occured: ', error);
  }
}
