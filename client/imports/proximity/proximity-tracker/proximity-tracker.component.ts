import { Component, NgZone } from '@angular/core';
import { Random } from 'meteor/random';

import { ProximityService } from './../proximity.service';
import { SignalDispatcher } from './../../core/SignalDispatcher';

import template from './proximity-tracker.component.html';
import style from './proximity-tracker.component.scss';

export var ProximityTrackerSignals = {
    startTrackingDeviceDistance: 'arc.proximity.ProximityTracker.startTrackingDeviceDistance',
    stopTrackingDeviceDistance: 'arc.proximity.ProximityTracker.stopTrackingDeviceDistance',
    startTrackingDeviceLocation: 'arc.proximity.ProximityTracker.startTrackingDeviceLocation',
    stopTrackingDeviceLocation: 'arc.proximity.ProximityTracker.stopTrackingDeviceLocation',
}

export interface IDistanceTrackerArgs {
    id: string;
    deviceCoords: Coordinates
    callback?: (distance: number) => void
    context?: any;
}

export interface ILocationTrackerArgs {
    id: string;
    callback?: (coords: Coordinates) => void
    context?: any;
}

@Component({
    selector: 'proximity-tracker',
    template: template,
    styles: [style],
    providers: [ProximityService]
})
export class ProximityTrackerComponent {
    coords: Coordinates;
    watchHandleId = 0;
    positionCallCount = 0;
    positionList: Array<Coordinates> = [];
    maxPositionCalls = 150;

    distanceTrackers: IDistanceTrackerArgs[] = [];
    locationTrackers: ILocationTrackerArgs[] = [];

    constructor(private service: ProximityService, private zone: NgZone) { }

    ngOnInit() {
        SignalDispatcher.subscribe(ProximityTrackerSignals.startTrackingDeviceDistance, this.onStartTrackingDeviceDistance, this);
        SignalDispatcher.subscribe(ProximityTrackerSignals.stopTrackingDeviceDistance, this.onStopTrackingDeviceDistance, this);
        SignalDispatcher.subscribe(ProximityTrackerSignals.startTrackingDeviceLocation, this.onStartTrackingDeviceLocation, this);
        SignalDispatcher.subscribe(ProximityTrackerSignals.stopTrackingDeviceLocation, this.onStopTrackingDeviceLocation, this);

        this.watchPosition();
    }

    ngOnDestroy() {
        this.clearWatch();

        SignalDispatcher.unsubscribe(ProximityTrackerSignals.startTrackingDeviceDistance);
        SignalDispatcher.unsubscribe(ProximityTrackerSignals.stopTrackingDeviceDistance);
        SignalDispatcher.unsubscribe(ProximityTrackerSignals.startTrackingDeviceLocation);
        SignalDispatcher.unsubscribe(ProximityTrackerSignals.stopTrackingDeviceLocation);

        console.log('ProximityTrackerComponent - ngOnDestroy()');
    }

    watchPosition() {
        // this.watchHandleId = navigator.geolocation.watchPosition(
        //     position => this.onWatchSuccess(position),
        //     error => this.onWatchError(error),
        //     this.positionOptions
        // );
        this.watchHandleId = Meteor.setInterval(() => this.service.getPosition(
            position => this.onWatchSuccess(position),
            error => this.onWatchError(error)
        ), 15000);
    }

    clearWatch() {
        // navigator.geolocation.clearWatch(this.watchHandleId);
        Meteor.clearInterval(this.watchHandleId);
    }

    onWatchSuccess(position: Position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let coords: Coordinates = <any>{};
        for (let key in position.coords) {
            coords[key] = position.coords[key];
        }
        // CurrentLocation.upsert('current_location', { $set: coords });
        // console.log(lat, lng);
        this.coords = coords;
        Meteor.users.update(Meteor.userId(), {
            $set: {
                'profile.coords': this.coords
            }
        });
        this.locationTrackers.forEach(trk => { this.callbackObserver(trk.context, trk.callback, this.coords) });
        this.distanceTrackers.forEach(trk => {
            let distance = this.service.getDistanceFromLatLonInKm(
                trk.deviceCoords.latitude, trk.deviceCoords.longitude,
                this.coords.latitude, this.coords.longitude
            );
            this.callbackObserver(trk.context, trk.callback, distance);
        });
    }

    onWatchError(error) {
        console.log('onWatchError() ', error);
    }

    getCurrentPositionSuccess(position: Position) {

        if (this.positionCallCount < this.maxPositionCalls) {
            if (position.coords.accuracy < 30) {
                console.log(position.coords);

                this.positionList.push(position.coords);

                this.positionCallCount++;
            }

            //   this.getCurrentPosition();
        } else {
            //   let geo = Geolocation.findOne('device_location');
            // let accuracyList = <number[]>_.unique(_.pluck(this.positionList, 'accuracy'));
            // console.log('[accuracyList]', accuracyList);
            // let bestAccuracy = _.min(accuracyList);
            // console.log('[bestAccuracy]', bestAccuracy);
            // this.positionList = this.positionList.filter(pos => pos.accuracy === bestAccuracy);

            let reduceFn = (prev, curr) => prev + curr;
            let totalLat = _.pluck(this.positionList, 'latitude').reduce(reduceFn);
            let totalLng = _.pluck(this.positionList, 'longitude').reduce(reduceFn);
            let totalAlt = _.pluck(this.positionList, 'altitude').reduce(reduceFn);
            let coords: Coordinates = <any>{
                latitude: totalLat / this.positionList.length,
                longitude: totalLng / this.positionList.length,
                altitude: totalAlt / this.positionList.length
            };
            console.log('AVERAGE', coords);
            console.log(coords.latitude + ',' + coords.longitude);

            //   if (geo) {
            //     // Geolocation.update('device_location', { $set: coords });
            //   } else {
            //     coords['_id'] = 'device_location';
            //     // Geolocation.insert(coords);
            //   }

            this.positionList = [];
            this.positionCallCount = 0;
            this.watchPosition();

            let msg = coords.latitude + ',' + coords.longitude;
            alert(msg);
        }
    }

    onStartTrackingDeviceDistance(args: IDistanceTrackerArgs) {
        console.log('start tracking distance');

        let distance = 0;
        if (this.coords) {
            distance = this.service.getDistanceFromLatLonInKm(
                args.deviceCoords.latitude, args.deviceCoords.longitude,
                this.coords.latitude, this.coords.longitude
            );
        }

        this.startTracking(this.distanceTrackers, args, distance);
    }

    onStopTrackingDeviceDistance(args: IDistanceTrackerArgs) {
        console.log('stop tracking distance');

        this.stopTracking(this.distanceTrackers, args.id);
    }

    onStartTrackingDeviceLocation(args: ILocationTrackerArgs) {
        console.log('start tracking location');

        this.startTracking(this.locationTrackers, args, this.coords);
    }

    onStopTrackingDeviceLocation(args: ILocationTrackerArgs) {
        console.log('stop tracking location');
        this.stopTracking(this.locationTrackers, args.id);
    }

    callbackObserver(context, callback: Function, value) {
        if (context) {
            callback.call(context, value);
        } else {
            callback(value);
        }
    }

    startTracking(list: Array<any>, args: any, newValue: any) {
        let id = Random.id();
        args.id = id;

        this.callbackObserver(args.context, args.callback, newValue);

        list.push(args);
    }

    stopTracking(list: Array<any>, id: string) {
        let index = -1;
        let tracker = list.find((trk, idx) => {
            let result = trk.id === id;
            if (result) {
                index = idx;
            }
            return result;
        });
        if (tracker) {
            list.splice(index, 1);
        }
    }
}