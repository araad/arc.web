import { Injectable } from '@angular/core';

@Injectable()
export class ProximityService {
    positionOptions = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 120000
    };

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    private deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    getPosition(onWatchSuccess: (position: Position) => void, onWatchError: (error) => void) {
        navigator.geolocation.getCurrentPosition(
            position => onWatchSuccess(position),
            error => onWatchError(error),
            this.positionOptions
        );
    }
}