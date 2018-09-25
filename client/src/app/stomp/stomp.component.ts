import { Component, OnInit, OnDestroy } from '@angular/core';
import { StompService } from '@stomp/ng2-stompjs';
import { Observable } from 'rxjs/Observable';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-stomp',
  templateUrl: './stomp.component.html',
  styleUrls: ['./stomp.component.css']
})
export class StompComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public messages: Observable<Message>;
  public subscribed: boolean;
  public mq: Array<string> = [];
  public count = 0;
  private _counter = 1;

  constructor(private _stompService: StompService) { }

  ngOnInit() {
    this.subscribed = false;
    this.subscribe();
  }

  public subscribe() {
    if (this.subscribed) {
      return;
    }

    this.messages = this._stompService.subscribe('/topic/stomp');
    this.subscription = this.messages.subscribe(this.on_next);
    this.subscribed = true;
  }

  public unsubscribe() {
    if (!this.subscribed) {
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = null;
    this.messages = null;

    this.subscribed = false;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  public onSendMessage() {
    const _getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    this._stompService.publish('/topic/stomp',
      `{ type: "Test Message", data: [ ${this._counter}, ${_getRandomInt(1, 100)}, ${_getRandomInt(1, 100)}] }`);

    this._counter++;
  }

  public on_next = (message: Message) => {
    try {
      this.mq.push(message.body + '\n');

    this.count++;

    console.log(message);
    } catch (e) {
      console.error(e);
    }
  }
}
