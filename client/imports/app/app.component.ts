import { Component, ElementRef } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';

import { AddDeviceDialogComponent } from './../device/add-device-dialog/add-device-dialog.component';

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

  constructor(public dialog: MdDialog, private el: ElementRef) {
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
  }
}