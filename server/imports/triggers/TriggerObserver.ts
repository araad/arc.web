import { Triggers } from './../../../both/collections/trigger.collection';
import { ITrigger, ICondition } from './../../../both/models/ITrigger';
import { Device } from './../device/Device';
import { PanelInterfaces } from './../../../both/collections/panel-interface.collection';
import { IPanelInterface } from './../../../both/models/IPanelInterface';
import { IModule } from './../../../both/models/IModule';
import { Devices } from './../../../both/collections/devices.collection';
import { Registrations } from './../connector/Registrations';
import { ModuleFactory } from './../modules/ModuleFactory';

export class TriggerObserver {
    runningTriggers: Array<ITrigger> = [];

    constructor() {
        Triggers.find().observe({
            added: (trigger: ITrigger) => this.onTriggerAdded(trigger),
            changed: (newTrigger: ITrigger, oldTrigger: ITrigger) => this.onTriggerChanged(newTrigger, oldTrigger),
            removed: () => null
        });

        Meteor.setInterval(() => {
            this.runningTriggers.forEach(trigger => {
                if (this.checkConditions(trigger.endpoint, trigger.conditions)) {
                    console.log('condition met, executing trigger action');
                    this.runTriggerAction(trigger.endpoint, trigger.actionName);
                } else {
                    console.warn('condition not met');
                }
            });
        }, 10000);
    }

    onTriggerAdded(trigger: ITrigger) {
        if (trigger.active) {
            this.startTrigger(trigger);
        }
    }

    onTriggerChanged(newTrigger: ITrigger, oldTrigger: ITrigger) {
        if (newTrigger.active !== oldTrigger.active) {
            if (newTrigger.active) {
                this.startTrigger(newTrigger);
            } else {
                this.stopTrigger(newTrigger);
            }
        }
    }

    onTriggerRemoved(oldTrigger: ITrigger) { }

    startTrigger(trigger: ITrigger) {
        this.runningTriggers.push(trigger);
    }

    updateTrigger() { }

    stopTrigger(trigger: ITrigger) {
        this.runningTriggers = _.without(this.runningTriggers, _.findWhere(this.runningTriggers, { _id: trigger['_id'] }));
    }

    checkConditions(endpoint: string, conditions: ICondition[]) {
        console.log('conditions:', conditions.length);

        let ret = conditions.length > 0;

        for (let i = 0; i < conditions.length; i++) {
            let cond = conditions[i];
            if (cond.expressionName) {
                console.log('condition is preset expression');
                if (!this.checkPresetCondition(endpoint, cond.expressionName)) {
                    ret = false;
                    break;
                }
            } else if (cond.path && cond.operator && cond.value) {
                console.log('condition is custom expression');
                if (!this.checkCustomCondition(endpoint, cond)) {
                    ret = false;
                    break;
                }
            } else {
                console.warn("condition malformed");
            }
        }

        return ret;
    }

    checkPresetCondition(endpoint: string, expressionName: string) {
        let device = <Device>Devices.collection.findOne({ endpoint: endpoint }, {
            transform: doc => Device.createFromDoc(doc)
        });

        let parts = expressionName.split('.');

        if (device && device[expressionName]) {
            return device[expressionName].call(device);
        } else if (parts.length === 4) {
            let piType = parseInt(parts[0]);
            console.log(piType);
            let moduleListName = parts[1];
            console.log(moduleListName);
            let moduleInstanceId = parseInt(parts[2]);
            console.log(moduleInstanceId);
            expressionName = parts[3];
            console.log(expressionName);
            let pi = <IPanelInterface>PanelInterfaces.collection.findOne({ endpoint: endpoint, panelInterfaceType: piType });

            if (pi && pi[moduleListName] && _.isArray(pi[moduleListName])) {
                let modules = <IModule[]>pi[moduleListName];
                let moduleDoc = modules.find(module => module.instanceId === moduleInstanceId);
                if (moduleDoc) {
                    let module = ModuleFactory.createModuleInstanceFromDoc(moduleDoc);
                    if (module && module[expressionName]) {
                        return (<Function>module[expressionName]).call(module);
                    } else {
                        console.warn('expression not found on module');
                    }
                } else {
                    console.warn('module not found');
                }
            } else {
                console.warn('panel interface not found');
            }
        }

        return false;
    }

    checkCustomCondition(endpoint: string, condition: ICondition) {
        let value = {};
        value[condition.operator] = condition.value;

        let reg = Registrations.findOne({
            ep: endpoint,
            'resources.path': condition.path
        });

        let result = false;

        if (reg) {
            result = !!reg.resources.find(res => res.path === condition.path && res.value === condition.value);
        }

        console.log(result);

        return result;
    }

    runTriggerAction(endpoint: string, actionName: string) {
        let parts = actionName.split('.');
        if (parts.length === 1) {
            let device = <Device>Devices.collection.findOne({ endpoint: endpoint }, {
                transform: doc => Device.createFromDoc(doc)
            });

            if (device[actionName]) {
                device[actionName]();
            } else {
                console.warn('action not found on device');
            }
        } else if (parts.length === 4) {
            let piType = parseInt(parts[0]);
            console.log(piType);
            let moduleListName = parts[1];
            console.log(moduleListName);
            let moduleInstanceId = parseInt(parts[2]);
            console.log(moduleInstanceId);
            actionName = parts[3];
            console.log(actionName);
            let pi = <IPanelInterface>PanelInterfaces.collection.findOne({ endpoint: endpoint, panelInterfaceType: piType });

            if (pi && pi[moduleListName] && _.isArray(pi[moduleListName])) {
                let modules = <IModule[]>pi[moduleListName];
                let moduleDoc = modules.find(module => module.instanceId === moduleInstanceId);
                if (moduleDoc) {
                    let module = ModuleFactory.createModuleInstanceFromDoc(moduleDoc);
                    if (module && module[actionName]) {
                        (<Function>module[actionName]).call(module);
                    } else {
                        console.warn('action not found on module');
                    }
                } else {
                    console.warn('module not found');
                }
            } else {
                console.warn('panel interface not found');
            }
        } else {
            console.warn("actionName malformed");
        }
    }
}