import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.css'],
  providers: [ UserService ]
})
export class SocketComponent implements OnInit {
  user: User;
  connection: any;
  users: User[];
  status: string[] = ['available', 'away', 'bisy'];
  i: number = 1;
  @ViewChild('lbl') lbl: ElementRef;
  @ViewChild('input') input: ElementRef;

  constructor(private userService: UserService) { }

  ngOnInit() {
      this.connection = new WebSocket('ws://localhost:3000');

      window['WebSocket'] = window['WebSocket'] || window['MozWebSocket'];

      this.connection.onopen = function () {
        console.log('WebSocket on open');
      };

      this.connection.onerror = function (error) {
        console.log('WebSocket on error');
      };

      this.connection.onmessage = function (message) {
        try {
          console.log('You entered: ', message.data);
        } catch (e) {
          console.log('This doesn\'t look like a valid JSON: ',
              message.data);
          return;
        }
      };
  }

  enter(event: any) {
        if (event.key === 'Enter') {
          var msg = this.input.nativeElement.value;
          this.connection.send(msg);
          this.input.nativeElement.value = '';
          var p = document.createElement('p');
          p.textContent =  'You entered: ' + msg;
          this.lbl.nativeElement.appendChild(p);
        }
  }
}
