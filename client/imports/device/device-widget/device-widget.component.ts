import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogConfig } from '@angular/material';

import { DeviceProxy } from './../device.proxy';
import { GeotagDeviceDialogComponent } from './../geotag-device-dialog/geotag-device-dialog.component';
import { SignalDispatcher } from './../../core/SignalDispatcher';
import { IDistanceTrackerArgs, ProximityTrackerSignals } from './../../proximity/proximity-tracker/proximity-tracker.component';

import template from './device-widget.component.html';
import style from './device-widget.component.scss';

@Component({
    selector: 'device-widget',
    template: template,
    styles: [style]
})
export class DeviceWidgetComponent {
    @Input() device: DeviceProxy;
    trackerArgs: IDistanceTrackerArgs = <any>{};
    distance = 0;

    constructor(private router: Router, public dialog: MdDialog) {
    }

    ngOnInit() {
        this.trackerArgs.deviceCoords = this.device.coords;
        this.trackerArgs.callback = this.onDistanceChanged;
        this.trackerArgs.context = this;

        if (this.trackerArgs.deviceCoords) {
            SignalDispatcher.dispatch(ProximityTrackerSignals.startTrackingDeviceDistance, this.trackerArgs);
        }
    }

    ngOnDestroy() {
        if (this.trackerArgs.deviceCoords) {
            SignalDispatcher.dispatch(ProximityTrackerSignals.stopTrackingDeviceDistance, this.trackerArgs);
        }
    }

    onDistanceChanged(value) {
        console.log(value);
        this.distance = value;
    }

    onMoreClick() {
        console.log('routing');
        this.router.navigate(['device', this.device._id]);
    }

    onNameChange(value) {
        console.log("DeviceWidgetComponent - onNameChange() value: ", value);
        this.device.saveName(value);
    }

    onGeotagClick() {
        let dialogConfig = new MdDialogConfig();
        dialogConfig.height = '80vh';
        let dialogRef = this.dialog.open(GeotagDeviceDialogComponent, dialogConfig);
        dialogRef.componentInstance.deviceName = this.device.name;
        dialogRef.componentInstance.saveDelegate = (value: Coordinates, callback) => this.device.geotag(value, callback);
        dialogRef.componentInstance.deviceCoords = this.device.coords;
        dialogRef.afterClosed().subscribe(() => this.afterGeotagDeviceDialogClosed());
    }

    afterGeotagDeviceDialogClosed() {
        console.log("afterGeotagDeviceDialogClosed");
    }
}