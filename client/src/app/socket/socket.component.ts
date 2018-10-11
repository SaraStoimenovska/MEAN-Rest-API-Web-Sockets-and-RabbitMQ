import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { User } from '../model/user';

@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: [ './socket.component.css' ]
})
export class SocketComponent implements OnInit, AfterViewInit {
  user: User;
  connection: any;
  users: User[];
  status: string[] = [ 'available', 'away', 'bisy' ];
  username: String;
  color: false;
  @ViewChild('content') content: ElementRef;
  @ViewChild('input') input: ElementRef;

  constructor() {}

  ngOnInit() {
    this.connection = new WebSocket('ws://localhost:3000');

    window['WebSocket'] = window['WebSocket'] || window['MozWebSocket'];

    this.connection.onopen = function() {
      console.log('WebSocket on open');
    };

    this.connection.onerror = function(error) {
      console.log('WebSocket on error');
    };

    this.connection.onmessage = function(message) {
      console.log(JSON.parse(message.data));
      var json;
      try {
        json = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
      }

      if (json.type === 'history') {
        console.log(json.data);
        // entire message history
        for (let i = 0; i < json.data.length; i++) {
          let p = document.createElement('p');
          let span = document.createElement('span');
          span.innerHTML = '(' + new Date(json.data[i].time).toLocaleString() + ') <b>' + json.data[i].author + '</b>: ';
          span.innerHTML += json.data[i].text;
          span.setAttribute('style', 'border-radius: 5px; padding: 3px; color: white; background-color: ' + json.data[i].color);
          p.appendChild(span);
          document.getElementById('content').appendChild(p);
        }
      } else if (json.type === 'message') {
        // a single message
        let p = document.createElement('p');
        let span = document.createElement('span');
        span.innerHTML = '(' + new Date(json.data.time).toLocaleString() + ') <b>' + json.data.author + '</b>: ' + json.data.text;
        // span.setAttribute('style', 'border-radius: 5px; padding: 3px');
        span.setAttribute('style', 'border-radius: 5px; padding: 3px; color: white; background-color: ' + json.data.color);
        p.appendChild(span);
        // p.appendChild(document.createElement('br'));
        document.getElementById('content').appendChild(p);
      } else {
        console.log('Hmm..., I\'ve never seen JSON like this:', json);
      }
    };
  }

  ngAfterViewInit() {
    console.log(this);
    setTimeout(() => {
      this.username = prompt('Enter your username here:', '');
      if (this.username == '' || this.username == null) {
        this.username = 'Anonymous';
      }
      this.connection.send(this.username);
      document.getElementById('lbl').innerText = 'Hello ' + this.username + '. Enter your message here:';
    }, 1500);
  }

  enter(event: any) {
    if (event.key === 'Enter') {
      let msg = this.input.nativeElement.value;
      this.connection.send(msg);
      this.input.nativeElement.value = '';
    }
  }
}
