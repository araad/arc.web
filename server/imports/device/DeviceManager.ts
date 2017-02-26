import { Devices } from './../../../both/collections/devices.collection';
import { IDevice } from './../../../both/models/IDevice';
import { DevicePublications } from './DevicePublications';
import { DeviceObserver } from './DeviceObserver';
import { DeviceService } from './DeviceService';
import { Device } from './Device';
import { PanelInterfaceManager } from './../panel-interface/PanelInterfaceManager';
import { DeviceConnectorService } from './../connector/DeviceConnectorService';
import { Meteor } from 'meteor/meteor';

export namespace DeviceManager {
    export function Start() {
        DeviceConnectorService.Start(Meteor.settings['private'].Mbed_Connector_API_Key_Arc_Dev);

        new DevicePublications();
        new DeviceObserver();
        new DeviceService(getDevice);

        PanelInterfaceManager.start();

        DeviceConnectorService.on("load", onResourcesLoaded)
    }

    function onResourcesLoaded() {
        console.log("DeviceManager - onResourcesLoaded()");

        let devices = <Device[]>Devices.collection.find({ offline: false }).fetch();
        devices.forEach(dev => {
            let piId = PanelInterfaceManager.changePanelInterface(dev.endpoint, dev.panelInterfaceType, 0);
            Meteor.setTimeout(() => Devices.collection.update(dev._id, { $set: { panelInterface_id: piId } }), 0);
        });
    }

    function getDevice(id: string) {
        return <IDevice>Devices.collection.findOne(id, {
            transform: (doc) => {
                return Device.createFromDoc(doc);
            }
        });
    }
}