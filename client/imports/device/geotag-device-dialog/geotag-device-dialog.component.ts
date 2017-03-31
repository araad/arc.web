import { Component, ElementRef } from '@angular/core';
import { MdDialogRef, OverlayRef } from '@angular/material';

import { ProximityService } from './../../proximity/proximity.service';

import template from './geotag-device-dialog.component.html';
import style from './geotag-device-dialog.component.scss';

@Component({
    selector: 'geotag-device-dialog',
    template: template,
    styles: [style],
    providers: [ProximityService]
})
export class GeotagDeviceDialogComponent {
    lat: number;
    lng: number;
    selected: Coordinates;
    getPositionBusy = false;
    deviceName = "Device";
    deviceCoords: Coordinates;
    deviceMarkerIconUrl = 'http://maps.google.com/mapfiles/kml/paddle/blu-stars-lv.png';

    saveDelegate: (value: Coordinates, callback: (error, result) => void) => void

    constructor(public dialogRef: MdDialogRef<GeotagDeviceDialogComponent>, private elRef: ElementRef, private service: ProximityService) {
        let overlayRef = <OverlayRef>this.dialogRef['_overlayRef'];
        let dialogEl = <HTMLElement>(<HTMLElement>overlayRef['_pane']).firstElementChild;
        let el = <HTMLElement>this.elRef.nativeElement;
        let style = window.getComputedStyle(dialogEl);
        let padding = parseInt(style.paddingTop) + parseInt(style.paddingBottom);
        let height = parseFloat(style.height);
        el.style.height = (height - padding) + 'px';

        if (window.innerWidth < 768) {
            dialogEl.style.maxWidth = '90vw';
            dialogEl.style.width = '90vw';
        }

        this.getPosition();
    }

    onMapClick(coords: { lat: number, lng: number }) {
        this.selected = <any>{
            latitude: coords.lat,
            longitude: coords.lng
        };
    }

    onGetPositionClick() {
        this.getPosition();
    }

    getPosition() {
        if (this.getPositionBusy) return;

        this.getPositionBusy = true;
        this.service.getPosition(position => {
            this.selected = <any>{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            this.lat = this.selected.latitude;
            this.lng = this.selected.longitude;
            this.getPositionBusy = false;
        }, error => {
            console.log(error)
            this.getPositionBusy = false;
        });
    }

    onMarkerClick() {
        this.lat = this.selected.latitude;
        this.lng = this.selected.longitude;
    }

    onCenterChange(coords: { lat: number, lng: number }) {
        this.lat = coords.lat;
        this.lng = coords.lng;
    }

    onCancelClick() {
        this.dialogRef.close();
    }

    onSaveClick() {
        this.saveDelegate(this.selected, (error, result) => {
            if(error) {
            console.log(error);
        } else {
            this.dialogRef.close();
            }
        });
    }
}