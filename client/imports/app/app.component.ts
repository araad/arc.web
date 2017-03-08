import { Component, ElementRef } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';

import { AddDeviceDialogComponent } from './../device/add-device-dialog/add-device-dialog.component';
import { Geolocation } from './../../../both/collections/geolocation.collection';

import template from './app.component.html';
import style from './app.component.scss';

@Component({
  selector: 'app',
  template: template,
  styles: [style]
})
export class AppComponent {
  name = "Test";
  sidenavMode = 'side';
  sidenavOpened = true;
  menuBtnHidden = true;
  apList = [];

  constructor(public dialog: MdDialog, private el: ElementRef) {
    Meteor.subscribe("geolocation");

    if (el.nativeElement.clientWidth < 1024) {
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
      this.menuBtnHidden = false;
    }
  }

  addDeviceClick() {
    let dialogConfig = new MdDialogConfig();
    dialogConfig.height = '80vh';
    let dialogRef = this.dialog.open(AddDeviceDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(apList => this.apList = apList);
  }

  onGeolocateClick() {
    if (this.apList.length > 0) {
      let uri = "https://www.googleapis.com/geolocation/v1/geolocate?key="
      uri += Meteor.settings.public["Maps_API_Key_Arc_Dev"];
      let data = {
        wifiAccessPoints: []
      };

      this.apList.forEach(net => {
        data.wifiAccessPoints.push({
          macAddress: net.mac,
          signalStrength: net.signal
        });
      });

      HTTP.post(uri, data, (error, result) => {
        if (error) {
          console.log(error);
          alert(error.message);
        } else {
          Geolocation.remove({});
          Geolocation.insert(result.data.location);
          alert(result.content);
        }
      })
    }
  }
}