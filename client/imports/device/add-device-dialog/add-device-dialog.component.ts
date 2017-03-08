import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { HTTP } from 'meteor/http';

import template from './add-device-dialog.component.html';
import style from './add-device-dialog.component.scss';

interface INetwork {
    ssid: string;
    signal: number;
    mac: string;
    security: string;
}

@Component({
    selector: 'add-device-dialog',
    template: template,
    styles: [style]
})
export class AddDeviceDialogComponent implements OnInit {
    selectedNetwork: INetwork;
    networkList: Array<INetwork> = [];
    showSpinner = false;
    manualEntry = false;
    scanNetworks = false;

    constructor(public dialogRef: MdDialogRef<AddDeviceDialogComponent>) { }

    ngOnInit() { }

    onShowNetworkListClick() {
        this.showSpinner = true;
        this.scanNetworks = true;
        this.getNetworkList();
    }

    getNetworkList() {
        HTTP.get("http://192.168.4.1:333", (error, result) => this.onGetNetworkList(error, result));
    }

    onGetNetworkList(error, result) {
        console.log("error", error);

        if (!error) {
            this.networkList = this.networkList.concat(result.data.result);
            if (result.data.more) {
                this.getNetworkList();
            } else {
                this.showSpinner = false;
            }
        } else {
            console.log(error);
        }
    }

    onGeolocateClick() {
        
    }

    onNetworkSelect(network: INetwork) {
        console.log(network);
        this.selectedNetwork = network;
    }

    onSendClick(password: string) {
        this.showSpinner = true;
        HTTP.call("PUT", "http://192.168.4.1:333?ssid=" + this.selectedNetwork.ssid + "&pswd=" + password, {
        }, (error, result) => {
            this.showSpinner = false;
            this.dialogRef.close(this.networkList);
            if (error) {
                console.log(error);
            }
        });
    }

    onManualSendClick(ssid: string, password: string) {
        this.showSpinner = true;
        HTTP.call("PUT", "http://192.168.4.1:333?ssid=" + ssid + "&pswd=" + password, {
        }, (error, result) => {
            this.showSpinner = false;
            this.dialogRef.close(this.networkList);
            if (error) {
                console.log(error);
            }
        });
    }
}