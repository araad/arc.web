import { IDevice } from './../../../both/models/IDevice';
import { IRegistration, IRegistrationResource } from './../connector/IRegistration';
import { DeviceConnectorService } from './../connector/DeviceConnectorService';
import * as moment from 'moment';

export class Device implements IDevice {
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

    subscribe() {
        DeviceConnectorService.putResourceSubscription(this.endpoint, "/dev/0/pi_loaded");
    }

    unsubscribe() {
        DeviceConnectorService.deleteResourceSubscription(this.endpoint, "/dev/0/pi_loaded");
    }

    saveName(value: string) {
        console.log(this);
        console.log(this.name);
        console.log(value);
    }

    setCurrentTime() {
        let seconds = new Date().getTime() / 1000;
        seconds += moment().utcOffset() * 60;
        DeviceConnectorService.putResourceValue(this.endpoint, "/dev/0/time", seconds);
    }

    static createFromDevice(doc: IDevice) {
        let dev = new Device();

        for (var key in doc) {
            dev[key] = doc[key];
        }

        return dev;
    }

    static createFromRegistration(doc: IRegistration) {
        let dev = new Device();
        dev.endpoint = doc.ep;

        doc.resources.forEach(res => {
            dev.setField(res);
        });

        return dev;
    }

    setField(res: IRegistrationResource) {
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
        } else if (_.isEqual(pathParts[1], 'dev') && _.isEqual(pathParts[3], 'pi_loaded')) {
            this.panelInterfaceLoaded = !!parseInt(res.value);
        } else {
            console.log('error     ', res);
        }
    }

    static setResource() {

    }
}