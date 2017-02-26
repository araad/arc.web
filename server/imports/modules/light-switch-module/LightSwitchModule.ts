import { ModuleType } from './../../../../both/models/IModule';
import { ILightSwitchModule } from './../../../../both/models/ILightSwitchModule';
import { PanelInterfaces } from './../../../../both/collections/panel-interface.collection';
import { IRegistrationResource } from './../../connector/IRegistration';
import { DeviceConnectorService } from './../../connector/DeviceConnectorService';
import { ModuleBase } from './../ModuleBase';

export class LightSwitchModule extends ModuleBase implements ILightSwitchModule {
    name: string;
    switch: boolean;

    constructor(endpoint: string, instanceId: number) {
        super(endpoint, instanceId);
    }

    subscribe() {
        DeviceConnectorService.putResourceSubscription(this.endpoint, `/${this.moduleType}/${this.instanceId}/5850`);
    }

    unsubscribe() {
        DeviceConnectorService.deleteResourceSubscription(this.endpoint, `/${this.moduleType}/${this.instanceId}/5850`);
    }

    setSwitch(value: boolean) {
        console.log("LightSwitchModule - setLightSwitch() new value", value);
        this.setResource("5850", value);
    }

    setName(value: string) {
        if (!_.isNull(value) && !_.isUndefined(value) && _.isString(value) && value.trim().length >= 2) {
            PanelInterfaces.update(
                { endpoint: this.endpoint, "switches.instanceId": this.instanceId },
                { $set: { "switches.$.name": value } }
            );
        } else {
            throw new Meteor.Error("Error while saving name");
        }
        console.log("Device - saveName() end");
    }

    setField(res: IRegistrationResource) {
        console.log("LightSwitchModule - setField()", res);
        if (_.isEqual(typeof res.value, "string")) {
            let pathParts = res.path.split('/');
            if (_.isEqual(pathParts[1], this.moduleType.toString())
                && _.isEqual(pathParts[2], this.instanceId.toString())
                && _.isEqual(pathParts[3], '5850')) {
                this.switch = !!parseInt(res.value);
            }
        }
    }

    setResource(name: string, value) {
        let path = `/${this.moduleType}/${this.instanceId}/` + name;
        value = value ? '1' : '0';
        DeviceConnectorService.putResourceValue(this.endpoint, path, value);
    }

    getFieldName(type: number) {
        switch (type) {
            case 5850:
                return 'switch';
        }
    }
}

ModuleBase.typeMap.set(ModuleType.LightSwitch, LightSwitchModule);