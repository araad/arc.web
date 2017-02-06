import { Meteor } from 'meteor/meteor';
import { DeviceManager } from './imports/device/DeviceManager';
import { DevicePublications } from './imports/device/DevicePublications';
import { DeviceObserver } from './imports/device/DeviceObserver';
import { DeviceConnectorService } from './imports/connector/DeviceConnectorService';

Meteor.startup(() => {
    new DevicePublications();
    new DeviceObserver();

    DeviceConnectorService.Start(Meteor.settings['private'].Mbed_Connector_API_Key_Arc_Dev);

    DeviceManager.Start();
});