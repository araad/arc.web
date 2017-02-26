import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { HTTP } from 'meteor/http';

import template from './add-device-dialog.component.html';
import style from './add-device-dialog.component.scss';

@Component({
    selector: 'add-device-dialog',
    template: template,
    styles: [style]
})
export class AddDeviceDialogComponent implements OnInit {
    selectedNetwork: string;
    ssidListObservable: Observable<string[]>;
    ssidListSubscription: Subscription;
    ssidList: string[] = [];
    showSpinner = false;

    constructor(public dialogRef: MdDialogRef<AddDeviceDialogComponent>) { }

    ngOnInit() { }

    onShowNetworkListClick() {
        this.showSpinner = true;
        HTTP.get("http://192.168.4.1:333", (error, result) => {
            this.showSpinner = false;
            console.log("error", error);

            if (!error) {
                this.ssidList = result.data.result;
            } else {
                alert(error);
            }
        });
    }

    onNetworkSelect(ssid: string) {
        console.log(ssid);
        this.selectedNetwork = ssid;
    }

    onSendClick(password: string) {
        this.showSpinner = true;
        HTTP.call("PUT", "http://192.168.4.1:333?ssid=" + this.selectedNetwork + "&pswd=" + password, {
        }, (error, result) => {
            this.showSpinner = false;
            this.dialogRef.close();
            if (error) {
                alert(error);
            }
        });
    }
}