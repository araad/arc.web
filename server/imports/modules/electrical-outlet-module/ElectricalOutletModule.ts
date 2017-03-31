import { ModuleType } from './../../../../both/models/IModule';
import { IElectricalOutletModule } from './../../../../both/models/IElectricalOutletModule';
import { PanelInterfaces } from './../../../../both/collections/panel-interface.collection';
import { IRegistrationResource } from './../../connector/IRegistration';
import { DeviceConnectorService } from './../../connector/DeviceConnectorService';
import { ModuleBase } from './../ModuleBase';
import { PowerConsumptionCollection } from './../../../../both/collections/power-consumption.collection';
import { PowerConsumptionRecord } from './../../../../both/models/PowerConsumptionRecord';
import { Triggers } from './../../../../both/collections/trigger.collection';
import { IPanelInterface } from './../../../../both/models/IPanelInterface';
import { ITrigger, ICondition, Operator } from './../../../../both/models/ITrigger';

let timeoutcount = 0;

export class ElectricalOutletModule extends ModuleBase implements IElectricalOutletModule {
    name: string;
    state: boolean;
    powerConsumed: number;
    alwaysOnTrigger: boolean;
    locationTrigger: boolean;

    constructor(endpoint: string, instanceId: number) {
        super(endpoint, instanceId);

        let pi = <IPanelInterface>PanelInterfaces.findOne({ endpoint: this.endpoint, "outlets.instanceId": this.instanceId });
        if (pi) {
            let locationTrigger = Triggers.findOne({ endpoint: this.endpoint, actionName: `${pi.panelInterfaceType}.outlets.${this.instanceId}.onLocationTrigger` })
            if (!locationTrigger) {
                let trigger: ITrigger = <any>{};
                trigger.endpoint = '4dde4bbb-ae34-4387-8e35-f21e1c85a0f0';

                let condition1: ICondition = <any>{};
                condition1.path = `/3312/${this.instanceId}/5850`
                condition1.operator = Operator.IS;
                condition1.value = '1';

                let condition2: ICondition = <any>{};
                condition2.expressionName = "checkIfOutsideArea";

                trigger.conditions = [condition1, condition2];

                trigger.actionName = `${pi.panelInterfaceType}.outlets.${this.instanceId}.onLocationTrigger`;

                Triggers.insert(trigger);
            }
        }
    }

    subscribe() {
        DeviceConnectorService.putResourceSubscription(this.endpoint, `/${this.moduleType}/${this.instanceId}/5850`);
        DeviceConnectorService.putResourceSubscription(this.endpoint, `/${this.moduleType}/${this.instanceId}/5800`);
    }

    unsubscribe() {
        DeviceConnectorService.deleteResourceSubscription(this.endpoint, `/${this.moduleType}/${this.instanceId}/5850`);
        DeviceConnectorService.deleteResourceSubscription(this.endpoint, `/${this.moduleType}/${this.instanceId}/5800`);
    }

    setState(value: boolean) {
        console.log("ElectricalOutletModule - setState() new value", value);
        if (!value && this.alwaysOnTrigger) {
            throw new Meteor.Error("Always On");
        } else {
            this.setResource("5850", value ? '1' : '0');
        }
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
        console.log("ElectricalOutletModule - saveName() end");
    }

    setAlwaysOnTrigger(value: boolean) {
        console.log("ElectricalOutletModule - setAlwaysOnTrigger() new value", value);

        PanelInterfaces.update(
            { endpoint: this.endpoint, "outlets.instanceId": this.instanceId },
            { $set: { "outlets.$.alwaysOnTrigger": value } }
        );

        if(value) {
            this.setState(true);
            this.setLocationTrigger(false);
        }
    }

    setLocationTrigger(value: boolean) {
        console.log("ElectricalOutletModule - setLocationTrigger() new value", value);

        if (Meteor.user().profile.coords) {
            PanelInterfaces.update(
                { endpoint: this.endpoint, "outlets.instanceId": this.instanceId },
                { $set: { "outlets.$.locationTrigger": value } }
            );

            if(value) {
                this.setAlwaysOnTrigger(false);
            }

            this.updateTrigger('onLocationTrigger', value);
        } else {
            throw new Meteor.Error("Can not find user coordinates");
        }
    }

    setField(res: IRegistrationResource) {
        console.log("ElectricalOutletModule - setField()", res);
        if (_.isEqual(typeof res.value, "string")) {
            let pathParts = res.path.split('/');
            if (_.isEqual(pathParts[1], this.moduleType.toString())
                && _.isEqual(pathParts[2], this.instanceId.toString())) {
                if (_.isEqual(pathParts[3], '5850')) {
                    this.state = !!parseInt(res.value);
                } else if (_.isEqual(pathParts[3], '5800')) {
                    this.powerConsumed = parseFloat(res.value);
                    PowerConsumptionCollection.insert({
                        endpoint: this.endpoint,
                        moduleType: this.moduleType,
                        instanceId: this.instanceId,
                        timestamp: Date.now(),
                        value: this.powerConsumed
                    });
                }
            }
        }
    }

    setResource(name: string, value) {
        let path = `/${this.moduleType}/${this.instanceId}/` + name;
        DeviceConnectorService.putResourceValue(this.endpoint, path, value);
    }

    getFieldName(type: number) {
        switch (type) {
            case 5850:
                return 'state';
            case 5800:
                return 'powerConsumed';
        }
    }

    onLocationTrigger() {
        console.log('onLocationTrigger', this.endpoint, this.instanceId);
        let pi = PanelInterfaces.findOne({ endpoint: this.endpoint, "outlets.instanceId": this.instanceId });
        if (pi) {
            let module = pi['outlets'][this.instanceId];
            let timeout = module['sendOutsideAreaNotificationTimeout'];
            // If previous timeout has not expired then ignore this trigger call
            if (!timeout) {
                console.log('sending notification');
                PanelInterfaces.collection.update(
                    { endpoint: this.endpoint, "outlets.instanceId": this.instanceId },
                    { $set: { "outlets.$.sendOutsideAreaNotificationTimeout": Date.now() + 60000 } }
                );
            } else if (timeout < 0) {
                console.log('received response from client');
                Meteor.setTimeout(() => {
                    PanelInterfaces.collection.update(
                        { endpoint: this.endpoint, "outlets.instanceId": this.instanceId },
                        { $set: { "outlets.$.sendOutsideAreaNotificationTimeout": 0 } }
                    );
                }, 1000);
            } else if (timeout <= Date.now()) {
                console.log('timeout');
                this.setState(false);
                PanelInterfaces.collection.update(
                    { endpoint: this.endpoint, "outlets.instanceId": this.instanceId },
                    { $set: { "outlets.$.sendOutsideAreaNotificationTimeout": 0 } }
                );
            } else {
                console.log('waiting for timeout');
            }
        }
    }

    cancelOutsideAreaNotificationTimeout() {
        PanelInterfaces.collection.update(
            { endpoint: this.endpoint, "outlets.instanceId": this.instanceId },
            { $set: { "outlets.$.sendOutsideAreaNotificationTimeout": -1 } }
        );
    }

    updateTrigger(actionName: string, active: boolean) {
        let pi = <IPanelInterface>PanelInterfaces.findOne({ endpoint: this.endpoint, "outlets.instanceId": this.instanceId });
        if (pi) {
            let trigger = Triggers.findOne({ endpoint: this.endpoint, actionName: `${pi.panelInterfaceType}.outlets.${this.instanceId}.${actionName}` })
            if (trigger) {
                Triggers.update(trigger['_id'], { $set: { active: active } });
            } else {
                console.warn("Trigger not found", this.endpoint, `${pi.panelInterfaceType}.outlets.${this.instanceId}.${actionName}`);
            }
        } else {
            console.warn("PanelInterface not found", this.endpoint, "outlets");
        }
    }
}

ModuleBase.typeMap.set(ModuleType.ElectricalOutlet, ElectricalOutletModule);