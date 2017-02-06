import { DeviceServiceBase } from './../../../both/services/DeviceServiceBase';
import { IDevice } from './../../../both/models/IDevice';
import { applyMixins } from './../../../both/core/applyMixins';
import { Method } from './../core/MethodMetadata';

export class DeviceProxy extends DeviceServiceBase implements IDevice {
    _id: string;
    name: string;
    offline: boolean;

    endpoint: string;
    manufacturer: string;
    modelNumber: string;
    serialNumber: string;
    deviceType: string;
    panelInterfaceLoaded: boolean;
    panelInterfaceTypeId: string;

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
}