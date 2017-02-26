import { ModuleType } from './../../../../both/models/IModule';
import { IElectricalOutletModule } from './../../../../both/models/IElectricalOutletModule';
import { PanelInterfaces } from './../../../../both/collections/panel-interface.collection';
import { IRegistrationResource } from './../../connector/IRegistration';
import { DeviceConnectorService } from './../../connector/DeviceConnectorService';
import { ModuleBase } from './../ModuleBase';

export class ElectricalOutletModule extends ModuleBase implements IElectricalOutletModule {
    name: string;
    state: boolean;
    measuredCurrent: number;

    constructor(endpoint: string, instanceId: number) {
        super(endpoint, instanceId);
    }

    subscribe() {
        DeviceConnectorService.putResourceSubscription(this.endpoint, `/${this.moduleType}/${this.instanceId}/5850`);
        DeviceConnectorService.putResourceSubscription(this.endpoint, `/${this.moduleType}/${this.instanceId}/5700`);
    }

    unsubscribe() {
        DeviceConnectorService.deleteResourceSubscription(this.endpoint, `/${this.moduleType}/${this.instanceId}/5850`);
        DeviceConnectorService.deleteResourceSubscription(this.endpoint, `/${this.moduleType}/${this.instanceId}/5700`);
    }

    setState(value: boolean) {
        console.log("ElectricalOutletModule - setState() new value", value);
        this.setResource("5850", value);
    }

    setName(value: string) {
        console.log("ElectricalOutletModule - setName() new value", value);
        if (!_.isNull(value) && !_.isUndefined(value) && _.isString(value) && value.trim().length >= 2) {
            PanelInterfaces.update(
                { endpoint: this.endpoint, "outlets.instanceId": this.instanceId },
                { $set: { "outlets.$.name": value } }
            );
        } else {
            throw new Meteor.Error("Error while saving name");
        }
        console.log("Device - saveName() end");
    }

    setField(res: IRegistrationResource) {
        console.log("ElectricalOutletModule - setField()", res);
        if (_.isEqual(typeof res.value, "string")) {
            let pathParts = res.path.split('/');
            if (_.isEqual(pathParts[1], this.moduleType.toString())
                && _.isEqual(pathParts[2], this.instanceId.toString())) {
                if (_.isEqual(pathParts[3], '5850')) {
                    this.state = !!parseInt(res.value);
                } else if (_.isEqual(pathParts[3], '5700')) {
                    this.measuredCurrent = parseFloat(res.value);
                }
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
                return 'state';
            case 5700:
                return 'measuredCurrent';
        }
    }
}

ModuleBase.typeMap.set(ModuleType.ElectricalOutlet, ElectricalOutletModule);