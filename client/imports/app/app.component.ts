import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import template from './app.component.html';
import style from './app.component.scss';

import { Devices } from './../../../both/collections/devices.collection';
import { DeviceProxy } from './../device/device.proxy';

@Component({
  selector: 'app',
  template: template,
  styles: [style]
})
export class AppComponent implements OnInit, OnDestroy {
  name = "Test";
  devices: Observable<any[]>;
  devicesSub: Subscription;
  sidenavMode = 'side';
  sidenavOpened = true;
  menuBtnHidden = true;

  constructor(el: ElementRef) {
    if (el.nativeElement.clientWidth < 1024) {
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
      this.menuBtnHidden = false;
    }
  }

  ngOnInit() {
    this.devices = Devices.find({}, {
      transform: (doc) => new DeviceProxy(doc)
    }).zone();
    this.devicesSub = MeteorObservable.subscribe('allDevices').subscribe();
  }

  ngOnDestroy() {
    this.devicesSub.unsubscribe();
  }
}