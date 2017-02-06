import { Devices } from './../../../both/collections/devices.collection';
import { IDevice } from './../../../both/models/IDevice';
import { DeviceService } from './DeviceService';
import { Device } from './Device';

export namespace DeviceManager {
    export function Start() {
        let deviceService = new DeviceService(getDevice);
    }

    function getDevice(id: string) {
        return <IDevice>Devices.collection.findOne(id, {
            transform: (doc) => {
                return Device.createFromDevice(doc);
            }
        });
    }
}