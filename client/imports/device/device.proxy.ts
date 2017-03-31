import { Injectable } from '@angular/core';

import { DeviceServiceBase } from './../../../both/services/DeviceServiceBase';
import { IDevice } from './../../../both/models/IDevice';
import { IPanelInterface, PanelInterfaceType } from './../../../both/models/IPanelInterface';
import { Method } from './../core/MethodMetadata';

@Injectable()
export class DeviceProxy extends DeviceServiceBase implements IDevice {
    _id: string;
    name: string;
    offline: boolean;
    coords: Coordinates;

    manufacturer: string;
    modelNumber: string;
    serialNumber: string;
    deviceType: string;
    panelInterfaceType: PanelInterfaceType;
    panelInterface_id: string;

    constructor(doc: IDevice) {
        super();

        for (var key in doc) {
            this[key] = doc[key];
        }
    }

    @Method
    saveNameMethod(id: string, value: string, callback: (error, result) => void) { }

    saveName(value: string) {
        this.saveNameMethod(this._id, value, (error, result) => this.onSaveName(error, result));
    }

    onSaveName(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log('success', result);
        }
    }

    @Method
    geotagMethod(id: string, value: any, callback: (error, result) => void) { }

    geotag(value: Coordinates, callback?: (error, result) => void) {
        this.geotagMethod(this._id, value, callback);
    }

    @Method
    callSysHangSimMethod(id: string, callback: (error, result) => void) { }

    callSysHangSim() {
        this.callSysHangSimMethod(this._id, (error, result) => console.log(error));
    }
}