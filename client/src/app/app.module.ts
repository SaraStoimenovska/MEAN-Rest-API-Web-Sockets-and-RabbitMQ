import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule } from 'ngx-accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RestComponent } from './rest/rest.component';
import { SocketComponent } from './socket/socket.component';
import { UserService } from './services/user.service';
import { StompComponent } from './stomp/stomp.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rest', component: RestComponent },
  { path: 'socket', component: SocketComponent },
  { path: 'stomp', component: StompComponent }
];

const stompConfig: StompConfig = {
  url: 'ws://localhost:15674/ws',
  headers: {
    login: 'guest',
    passcode: 'guest'
  },
  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 5000,
  debug: true
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RestComponent,
    SocketComponent,
    StompComponent,
  ],
  exports: [
  ],
  imports: [
    BrowserModule,
    AccordionModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ UserService,
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
