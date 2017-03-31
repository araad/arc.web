import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { Devices } from './../../../../both/collections/devices.collection';
import { DeviceProxy } from './../device.proxy';
import { PanelInterfaces } from './../../../../both/collections/panel-interface.collection';

import { SignalDispatcher } from './../../core/SignalDispatcher';

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
    distance: number;
    currentLocationHandle: Meteor.LiveQueryHandle;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.paramsSub = this.route.params
            .map(params => params['deviceId'])
            .subscribe(deviceId => {
                this.deviceId = deviceId;

                this.device = <DeviceProxy>Devices.findOne(this.deviceId, { transform: doc => new DeviceProxy(doc) });
            });
    }

    updateDistance(coords: Coordinates) {
        // let deviceLoc = Geolocation.findOne();
        // if (deviceLoc) {
        //     this.distance = Proximity.getDistanceFromLatLonInKm(deviceLoc.latitude, deviceLoc.longitude, coords.latitude, coords.longitude);
        // }
    }

    ngOnDestroy() {
        this.paramsSub.unsubscribe();

        if(this.currentLocationHandle) this.currentLocationHandle.stop();
    }

    onDeleteClick() {
        let msgArgs: IMessageBoxArgs = {
            callback: (result) => {
                console.log('msgbox result ->', result);
            },
            title: 'Confirm delete',
            text1: 'Are you sure you want to remove this device?',
            text2: '',
            type: MessageBoxType.warn,
            buttonsType: MessageBoxButtonsType.CancelAccept
        };

        SignalDispatcher.dispatch(MessageBoxSignals.show, msgArgs);
    }

    onSysHangSimClick() {
        this.device.callSysHangSim();
    }
}