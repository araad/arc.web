import { Component, ElementRef, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { Tracker } from 'meteor/tracker';

import { AddDeviceDialogComponent } from './../device/add-device-dialog/add-device-dialog.component';

import template from './app.component.html';
import style from './app.component.scss';

let LocalNotificationApi;

@Component({
  selector: 'app',
  template: template,
  styles: [style]
})
export class AppComponent implements OnInit, OnDestroy {
  name = "Test";
  sidenavMode = 'side';
  sidenavOpened = true;
  menuBtnHidden = true;
  loggedIn: boolean;
  comp: Tracker.Computation;
  isCordova;

  constructor(public dialog: MdDialog, private el: ElementRef, private router: Router, private zone: NgZone, private cdr: ChangeDetectorRef) {

    if (el.nativeElement.clientWidth < 1024) {
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
      this.menuBtnHidden = false;
    }

    this.isCordova = Meteor.isCordova;

    if (Meteor.isCordova) {
      if (window['cordova'] && window['cordova'].plugins) {
        LocalNotificationApi = window['cordova'].plugins.notification.local;
      }
    } else if (Notification) {
      if (Notification['permission'] !== 'granted') {
        Notification.requestPermission();
      }
    }
  }

  ngOnInit() {
    this.comp = Tracker.autorun(() => this.zone.run(() => {
      this.cdr.detach();
      let loggedIn = !!Meteor.user();
      if (this.loggedIn && !loggedIn) {
        Meteor.setTimeout(() => this.zone.run(() => this.router.navigate(['login'])), 0);
      }
      this.loggedIn = loggedIn;
      Meteor.setTimeout(() => this.cdr.reattach(), 0);
    }));

    // if (LocalNotificationApi) {
    //   console.log('LocalNotificationApi scheduling notification');
    //   var now = new Date().getTime(),
    //     _5_sec_from_now = new Date(now + 10 * 1000);
    //   LocalNotificationApi.schedule({
    //     id: 1,
    //     at: _5_sec_from_now,
    //     text: "Single Notification",
    //     led: "00FF01"
    //   });
    // } else {
    //   console.log('LocalNotificationApi not found');
    // }
  }

  ngOnDestroy() {
    if (this.comp) {
      this.comp.stop();
    }
  }

  onOverviewClick() {
    this.router.navigate(['']);
  }

  onDevicesClick() {
    this.router.navigate(['device']);
  }

  onScheduleClick() {

  }

  onMapClick() {
    this.router.navigate(['map']);
  }

  addDeviceClick() {
    let dialogConfig = new MdDialogConfig();
    dialogConfig.height = '80vh';
    let dialogRef = this.dialog.open(AddDeviceDialogComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(apList => this.apList = apList);
  }

  logout() {
    Meteor.logout();
    this.router.navigate(['login']);
  }
}