import { Component, OnInit, ElementRef, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MdDialogRef, OverlayRef } from '@angular/material';
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

let WifiWizard;
let BarcodeScanner;

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
    page = 0;
    isMobile = Meteor.isCordova;
    currentSSIDRetries = 0;
    deviceSsid = "";
    devicePswd = "";
    @ViewChild('deviceSsidInput') deviceSsidInput: HTMLInputElement;
    @ViewChild('devicePswdInput') devicePswdInput: HTMLInputElement;
    deviceEndpoint: string;

    constructor(public dialogRef: MdDialogRef<AddDeviceDialogComponent>, private elRef: ElementRef, private zone: NgZone, private cdr: ChangeDetectorRef) {
        let overlayRef = <OverlayRef>this.dialogRef['_overlayRef'];
        let dialogEl = <HTMLElement>(<HTMLElement>overlayRef['_pane']).firstElementChild;
        let el = <HTMLElement>this.elRef.nativeElement;
        let style = window.getComputedStyle(dialogEl);
        let padding = parseInt(style.paddingTop) + parseInt(style.paddingBottom);
        let height = parseFloat(style.height);
        el.style.height = (height - padding) + 'px';

        if(window.innerWidth < 768) {
            dialogEl.style.maxWidth = '90vw';
            dialogEl.style.width = '90vw';
        }

        if (this.isMobile) {
            WifiWizard = window['WifiWizard'];

            if (window['cordova'] && window['cordova'].plugins) {
                BarcodeScanner = window['cordova'].plugins.barcodeScanner;
            }
        }
    }

    ngOnInit() {

    }

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
            // this.dialogRef.close(this.networkList);
            this.page = 3;
            if (error) {
                console.log(error);
            }
        });
    }

    onCancelClick() {
        this.dialogRef.close();
    }

    onNextClick(ssid, pswd) {
        switch (this.page) {
            case 0:
                {
                    this.page = 1;
                    break;
                }
            case 1:
                {
                    if (this.isMobile) {
                        this.connectToDeviceWifi(ssid, pswd);
                    } else {
                        this.getDeviceEndpoint(1000);
                    }
                    break;
                }
            case 2:
                {
                    this.onManualSendClick(ssid, pswd);
                    break;
                }
            default:
                break;
        }
    }

    connectToDeviceWifi(ssid: string, pswd: string) {
        this.showSpinner = true;
        console.log('ssid:', ssid);
        console.log('pswd:', pswd);

        WifiWizard.startScan(result => {
            WifiWizard.getScanResults({}, networks => {
                let found = false;
                for (let i = 0; i < networks.length; i++) {
                    if (_.isEqual(networks[i].SSID, ssid)) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    WifiWizard.connectNetwork(ssid,
                        result => this.onConnectNetworkSuccess(result, ssid),
                        error => this.onConnectNetworkError(error));
                } else {
                    alert("Cannot find network: " + ssid);
                    console.log("Cannon find network:", ssid);
                    this.showSpinner = false;
                }
            }, error => {
                console.log(error);
            })
        }, error => {
            console.log(error);
        });
    }

    onConnectNetworkSuccess(result, ssid) {
        console.log(result);
        Meteor.setTimeout(() => {
            WifiWizard.getCurrentSSID(
                (currentSSID: string) => this.onGetCurrentSSIDSuccess(currentSSID.replace(/\"/g, ""), ssid),
                error => this.onGetCurrentSSIDError(error));
        }, 10000);
    }

    onConnectNetworkError(error) {
        this.showSpinner = false;
        console.log(error);
        alert(error);
    }

    onGetCurrentSSIDSuccess(currentSSID, ssid) {
        console.log(currentSSID)
        console.log(ssid);
        if (!_.isEqual(ssid, currentSSID)) {
            if (this.currentSSIDRetries++ < 5) {
                this.onConnectNetworkSuccess(null, ssid);
            } else {
                this.showSpinner = false;
                this.currentSSIDRetries = 0;
            }
        } else {
            this.getDeviceEndpoint(10000);
        }
    }

    getDeviceEndpoint(delay: number) {
        this.showSpinner = true;
        Meteor.setTimeout(() => {
            HTTP.get("http://192.168.4.1:333", (error, result) => this.onGetDeviceEndpoint(error, result))
        }, delay);
    }

    onGetDeviceEndpoint(error, result) {
        if (!error) {
            this.showSpinner = false;
            this.page = 2;
            this.deviceEndpoint = result.content;
        } else {
            console.log(error);
            this.showSpinner = false;
        }
    }

    onGetCurrentSSIDError(error) {
        this.showSpinner = false;
        console.log(error);
    }

    onScanQRCodeClick() {
        console.log('opening barcodeScanner');
        BarcodeScanner.scan(result => {
            let parts = (<string>result.text).split(';');
            if (parts[0].startsWith('WIFI')) {
                this.cdr.detach();
                this.deviceSsid = this.deviceSsidInput.value = parts[1].split(':')[1];
                this.devicePswd = this.devicePswdInput.value = parts[2].split(':')[1];
                Meteor.setTimeout(() => this.zone.run(() => {
                    this.cdr.reattach();
                }), 0);
            } else {
                alert('Invalid QR Code');
            }
        }, error => {
            console.log(error);
            alert(error);
        });
    }
}