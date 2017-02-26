import { Registrations } from './../connector/Registrations';
import { IRegistration, IRegistrationResource } from './../connector/IRegistration';
import { Device } from './Device';
import { Devices } from './../../../both/collections/devices.collection';
import { PanelInterfaceManager } from './../panel-interface/PanelInterfaceManager';
import { DeviceConnectorService } from './../connector/DeviceConnectorService';
import { Mongo } from 'meteor/mongo';

export class DeviceObserver {
    init = true;

    constructor() {

        Registrations.find({}).observe({
            added: (reg: IRegistration) => this.added(reg),
            changed: (newReg: IRegistration, oldReg: IRegistration) => this.changed(newReg, oldReg),
            removed: (reg: IRegistration) => this.removed(reg)
        });

        Devices.collection.find({}).observe({
            added: (dev: Device) => this.deviceAdded(dev),
            changed: (newDev: Device, oldDev: Device) => this.deviceChanged(newDev, oldDev),
            removed: (dev: Device) => this.deviceRemoved(dev)
        });

        this.init = false;
    }

    added(reg: IRegistration) {
        if (!this.init) {
            console.log('DeviceObserver - added() begin');

            let regDevice = Device.createFromResources(reg.resources);
            regDevice.endpoint = reg.ep;
            regDevice.offline = false;

            let device = <Device>Devices.collection.findOne({ endpoint: reg.ep });
            if (device) {
                console.log('++++++++++ regDevice');
                Devices.update(device._id, { $set: regDevice });
            } else {
                regDevice.name = "Device " + (Devices.collection.find().count() + 1);
                Devices.insert(regDevice);
            }

            regDevice.setCurrentTime();

            console.log('DeviceObserver - added() end');
        }
    }

    changed(newReg: IRegistration, oldReg: IRegistration) {
        console.log('DeviceObserver - changed() begin');
        newReg.resources.forEach(newRes => {
            let oldRes = oldReg.resources.find(res => _.isEqual(res.path, newRes.path));
            if (oldRes) {
                if (!_.isEqual(oldRes.value, newRes.value)) {
                    console.log('setting existing field');
                    this.setField(oldReg.ep, newRes);
                }
            } else {
                console.log('setting new field');
                this.setField(oldReg.ep, newRes);
            }
        });
        console.log('DeviceObserver - changed() end');
    }

    setField(ep: string, res: IRegistrationResource) {
        console.log('DeviceObserver - setField() begin');
        console.log("field", res.path);
        let device = Device.createFromDoc(<Device>Devices.collection.findOne({ endpoint: ep }));
        if (res.path.startsWith("/3/") || res.path.startsWith("/dev/")) {
            device.setField(res);
            Devices.collection.update({ endpoint: ep }, { $set: device });
        } else if (device.panelInterface_id) {
            PanelInterfaceManager.syncPanel(ep, device.panelInterface_id, device.panelInterfaceType, res);
        } else {
            console.warn("no panelInterface_id");
        }
        console.log('DeviceObserver - setField() end');
    }

    removed(reg: IRegistration) {
        console.log('DeviceObserver - removed() begin');
        let device = <Device>Devices.findOne({ endpoint: reg.ep });
        if (device) {
            Devices.update(device._id, { $set: { offline: true } });
        }
        console.log('DeviceObserver - removed() end');
    }

    deviceAdded(dev: Device) {
        if (!this.init) {
            console.log('DeviceObserver - deviceAdded() begin');

            dev = Device.createFromDoc(dev);
            dev.subscribe();

            let piId = PanelInterfaceManager.changePanelInterface(dev.endpoint, dev.panelInterfaceType, 0);
            Meteor.setTimeout(() => Devices.collection.update(dev._id, { $set: { panelInterface_id: piId } }), 0);

            console.log('DeviceObserver - deviceAdded() end');
        }
    }

    deviceChanged(newDev: Device, oldDev: Device) {
        console.log('DeviceObserver - deviceChanged() begin');

        if (newDev.offline !== oldDev.offline) {
            let dev = <Device>Devices.collection.findOne(newDev._id, { transform: doc => Device.createFromDoc(doc) });
            if (newDev.offline) {
                console.log("Device (id:", newDev._id, ") OFFLINE");
                Meteor.setTimeout(() => Devices.collection.update(newDev._id, { $set: { panelInterfaceType: 0 } }), 0);
                dev.unsubscribe();
            } else {
                console.log("Device (id:", newDev._id, ") ONLINE");
                dev.subscribe();
            }
        }

        if (newDev.panelInterfaceType !== oldDev.panelInterfaceType) {
            let piId = PanelInterfaceManager.changePanelInterface(
                newDev.endpoint,
                newDev.panelInterfaceType,
                oldDev.panelInterfaceType
            );
            Meteor.setTimeout(() => Devices.collection.update(newDev._id, { $set: { panelInterface_id: piId } }), 0);
        }

        console.log('DeviceObserver - deviceChanged() end');
    }

    deviceRemoved(dev: Device) {
        console.log('DeviceObserver - deviceRemoved() begin');
        dev = Device.createFromDoc(dev);
        dev.unsubscribe();
        console.log('DeviceObserver - deviceRemoved() end');
    }
}