import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { Devices } from './../../../../both/collections/devices.collection';
import { PanelInterfaces } from './../../../../both/collections/panel-interface.collection';
import { DeviceProxy } from './../device.proxy';

import template from './device-list.component.html';
import style from './device-list.component.scss';

@Component({
    selector: 'device-list',
    template: template,
    styles: [style]
})
export class DeviceListComponent implements OnInit, OnDestroy {
    devices: Observable<any[]>;
    devicesSub: Subscription;
    panelInterfacesSub: Subscription;
    positionOptions = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 120000
    };
    coords: Coordinates;
    currentLocationHandle: Meteor.LiveQueryHandle;

    ngOnInit() {
        this.devices = Devices.find({}, {
            transform: (doc) => new DeviceProxy(doc)
        }).zone();
        this.devicesSub = MeteorObservable.subscribe('allDevices').subscribe();
        this.panelInterfacesSub = MeteorObservable.subscribe('allPanelInterfaces').subscribe();
    }

    ngOnDestroy() {
        this.devicesSub.unsubscribe();

        if (this.currentLocationHandle) this.currentLocationHandle.stop();

        console.log('DeviceListComponent - ngOnDestroy()');
    }
}