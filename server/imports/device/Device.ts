import { IDevice } from './../../../both/models/IDevice';
import { IRegistration, IRegistrationResource } from './../connector/IRegistration';
import { DeviceConnectorService } from './../connector/DeviceConnectorService';
import { IResourceManager } from './../connector/IResourceManager';
import { Devices } from './../../../both/collections/devices.collection';
import * as moment from 'moment';

export class Device implements IDevice, IResourceManager {
    _id: string;
    name: string;
    offline: boolean;

    endpoint: string;
    manufacturer: string;
    modelNumber: string;
    serialNumber: string;
    deviceType: string;
    panelInterfaceType: number;
    panelInterface_id: string;

    subscribe() {
        DeviceConnectorService.putResourceSubscription(this.endpoint, "/dev/0/pi_id");
    }

    unsubscribe() {
        DeviceConnectorService.deleteResourceSubscription(this.endpoint, "/dev/0/pi_id");
    }

    saveName(value: string) {
        console.log("Device - saveName() begin");
        console.log(this.name);
        console.trace(value);
        if (!_.isNull(value) && !_.isUndefined(value) && _.isString(value) && value.trim().length > 2) {
            Devices.collection.update(this._id, { $set: { name: value } });
        } else {
            throw new Meteor.Error("Error while saving name");
        }
        console.log("Device - saveName() end");
    }

    setCurrentTime() {
        let seconds = new Date().getTime() / 1000;
        seconds += moment().utcOffset() * 60;
        DeviceConnectorService.postResource(this.endpoint, "/dev/0/time", seconds);
    }

    callSysHangSim() {
        DeviceConnectorService.postResource(this.endpoint, "dev/0/sys_hang", '1');
    }

    static createFromDoc(doc: IDevice) {
        let dev = new Device();

        for (var key in doc) {
            dev[key] = doc[key];
        }

        return dev;
    }

    static createFromResources(resources: IRegistrationResource[]) {
        let dev = new Device();

        resources.forEach(res => {
            dev.setField(res);
        });

        return dev;
    }

    setField(res: IRegistrationResource) {
        if (_.isEqual(typeof res.value, "string")) {
            let pathParts = res.path.split('/');
            if (_.isEqual(pathParts[1], '3')) {
                let valueParts = (<string>res.value).split('�\u0002\r');
                this.serialNumber = valueParts[1];
                valueParts = valueParts[0].split('�\u0001\f');
                this.modelNumber = valueParts[1];
                valueParts = valueParts[0].split('�\u0011\n');
                this.deviceType = valueParts[1];
                valueParts = valueParts[0].split('�\u0000');
                this.manufacturer = valueParts[1];
            } else if (_.isEqual(pathParts[1], 'dev') && _.isEqual(pathParts[3], 'pi_id')) {
                this.panelInterfaceType = parseInt(res.value);
            }
        }
    }

    setResource(name: string, value) {

    }
}