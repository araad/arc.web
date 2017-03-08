import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { Devices } from './../../../../both/collections/devices.collection';
import { DeviceProxy } from './../device.proxy';
import { PanelInterfaces } from './../../../../both/collections/panel-interface.collection';
import { Geolocation } from './../../../../both/collections/geolocation.collection';

import { SignalDispatcher, ISignalArgs } from './../../core/SignalDispatcher';

import { MessageBoxSignals, MessageBoxType, IMessageBoxArgs, MessageBoxButtonsType, MessageBoxResult } from './../../core-ui/message-box/message-box.component';

import template from './device-details.component.html';
import style from './device-details.component.scss';

@Component({
    selector: 'device-details',
    template: template,
    styles: [style]
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
    deviceId: string;
    paramsSub: Subscription;
    device: DeviceProxy;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.paramsSub = this.route.params
            .map(params => params['deviceId'])
            .subscribe(deviceId => {
                this.deviceId = deviceId;

                this.device = <DeviceProxy>Devices.findOne(this.deviceId, { transform: doc => new DeviceProxy(doc) });
            });
    }

    ngOnDestroy() {
        this.paramsSub.unsubscribe();
    }

    onDeleteClick() {
        let msgArgs: IMessageBoxArgs = {
            callback: (result) => {
                console.log('msgbox result ->', result);
            },
            title: 'Confirm delete',
            text: 'Are you sure you want to remove this device?',
            type: MessageBoxType.warn,
            buttonsType: MessageBoxButtonsType.CancelAccept
        };

        let sigArgs: ISignalArgs = {
            callback: (result) => {
                console.log('result ->', result);
            },
            data: msgArgs
        };

        SignalDispatcher.dispatch(MessageBoxSignals.show, sigArgs);
    }

    onGetDistanceClick() {
        navigator.geolocation.getCurrentPosition((position: Position) => {
            let location = <any>Geolocation.findOne();
            if (location) {
                let result = this.getDistanceFromLatLonInKm(location.lat, location.lng, position.coords.latitude, position.coords.longitude);
                alert(result);
            }
        }, (error: PositionError) => {
            alert(error.message);
        }, {
            enableHighAccuracy: true
        });
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 1.609344;
        return dist * 100;
    }

    onSysHangSimClick() {
        this.device.callSysHangSim();
    }
}