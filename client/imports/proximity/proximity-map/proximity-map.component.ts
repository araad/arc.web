import { Component } from '@angular/core';

import { ILocationTrackerArgs, ProximityTrackerSignals } from './../proximity-tracker/proximity-tracker.component';
import { SignalDispatcher } from './../../core/SignalDispatcher';
import { ProximityService } from './../proximity.service';

import template from './proximity-map.component.html';
import style from './proximity-map.component.scss';

@Component({
    selector: 'proximity-map',
    template: template,
    styles: [style],
    providers: [ProximityService]
})
export class ProximityMapComponent {
    deviceLat = 45.560490;
    deviceLng = -73.714119;
    lat = this.deviceLat;
    lng = this.deviceLng;
    trackerArgs: ILocationTrackerArgs = <any>{};
    coordsList: Array<Coordinates> = [];

    constructor(private service: ProximityService) {

    }

    ngOnInit() {
        this.trackerArgs.callback = this.onLocationChange;
        this.trackerArgs.context = this;

        SignalDispatcher.dispatch(ProximityTrackerSignals.startTrackingDeviceLocation, this.trackerArgs);
    }

    ngOnDestroy() {
        SignalDispatcher.dispatch(ProximityTrackerSignals.stopTrackingDeviceLocation, this.trackerArgs);

        console.log('ProximityMapComponent - ngOnDestroy()');
    }

    onLocationChange(coords: Coordinates) {
        if (coords) {
            this.coordsList.push(coords);
        }
    }

    onDeviceMarkerClick() {
        this.lat = this.deviceLat;
        this.lng = this.deviceLng;
    }

    onMarkerClick(coords: Coordinates) {
        this.lat = coords.latitude;
        this.lng = coords.longitude;

        let distance = this.service.getDistanceFromLatLonInKm(this.lat, this.lng, this.deviceLat, this.deviceLng);
        
        alert(distance);
    }
}