import { Meteor } from 'meteor/meteor';
import { DeviceManager } from './imports/device/DeviceManager';
import { TestPanelService } from './imports/test-panel/TestPanelService';
import { LightSwitchPanelService } from './imports/light-switch-panel/LightSwitchPanelService';
import { ElectricalOutletPanelService } from './imports/electrical-outlet-panel/ElectricalOutletPanelService';
import { TriggerManager } from './imports/triggers/TriggerManager';
import { setUsers } from './users';

Meteor.startup(() => {
    setUsers();

    new ElectricalOutletPanelService();
    new LightSwitchPanelService();

    DeviceManager.Start();
    TriggerManager.Start();
});