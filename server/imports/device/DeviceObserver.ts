import { Registrations } from './../connector/Registrations';
import { IRegistration, IRegistrationResource } from './../connector/IRegistration';
import { Device } from './Device';
import { IDevice } from './../../../both/models/IDevice';
import { Devices } from './../../../both/collections/devices.collection';
import { Mongo } from 'meteor/mongo';

export class DeviceObserver {
    init = true;

    constructor() {

        Registrations.find({}).observe({
            added: (reg: IRegistration) => this.added(reg),
            changed: (newReg: IRegistration, oldReg: IRegistration) => this.changed(newReg, oldReg),
            removed: (reg: IRegistration) => this.removed(reg)
        });

        Devices.collection.find({}).observeChanges({
            changed: (id: string, dev: Device) => this.deviceChanged(id, dev)
        });

        Devices.collection.find({}).observe({
            added: (dev: Device) => this.deviceAdded(dev),
            removed: (dev: Device) => this.deviceRemoved(dev)
        });

        this.init = false;
    }

    added(reg: IRegistration) {
        if (!this.init) {
            console.log('++++++++++++++++');
            let regDevice = Device.createFromRegistration(reg);
            console.log(regDevice);
            regDevice.offline = false;
            let device = <Device>Devices.collection.findOne({ endpoint: reg.ep });
            if (device) {
                console.log('++++++++++ regDevice');
                Devices.update(device._id, { $set: regDevice });
            } else {
                Devices.insert(regDevice);
            }
        }
    }

    changed(newReg: IRegistration, oldReg: IRegistration) {
        console.log('***************');
        newReg.resources.forEach(newRes => {
            let oldRes = oldReg.resources.find(res => _.isEqual(res.path, newRes.path));
            if (oldRes) {
                if (!_.isEqual(oldRes.value, newRes.value)) {
                    console.log('setting field');
                    this.setField(oldReg.ep, newRes);
                }
            } else {
                console.log('setting field 2');
                this.setField(oldReg.ep, newRes);
            }
        });
    }

    setField(ep: string, res: IRegistrationResource) {
        let device = Device.createFromDevice(<IDevice>Devices.collection.findOne({ endpoint: ep }));
        device.setField(res);
        Devices.collection.update({ endpoint: ep }, { $set: device });
    }

    removed(reg: IRegistration) {
        console.log('----------------------');
        let device = <Device>Devices.findOne({ endpoint: reg.ep });
        if (device) {
            Devices.update(device._id, { $set: { offline: true } });
        }
    }

    deviceAdded(dev: Device) {
        if (!this.init) {
            dev = Device.createFromDevice(dev);
            dev.subscribe();
        }
    }

    deviceChanged(id: string, changes: Device) {
        let changesObj = new Object(changes);
        if (changesObj.hasOwnProperty("offline")) {
            let dev = <Device>Devices.collection.findOne(id, { transform: doc => Device.createFromDevice(doc) });
            if (changes.offline) {
                console.log("Device (id:", id, ") OFFLINE");
                dev.unsubscribe()
            } else {
                console.log("Device (id:", id, ") ONLINE");
                dev.subscribe();
            }
        }
    }

    deviceRemoved(dev: Device) {
        dev = Device.createFromDevice(dev);
        dev.unsubscribe();
    }
}