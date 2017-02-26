import { PanelInterfaceType } from './../../../both/models/IPanelInterface';
import { ILightSwitchPanel } from './../../../both/models/ILightSwitchPanel';
import { IRegistrationResource } from './../connector/IRegistration';
import { DeviceConnectorService } from './../connector/DeviceConnectorService';
import { PanelInterfaceBase } from './../panel-interface/PanelInterfaceBase';
import { ModuleType } from './../../../both/models/IModule';
import { ModuleFactory } from './../modules/ModuleFactory';
import { LightSwitchModule } from './../modules/light-switch-module/LightSwitchModule';

LightSwitchModule;

import { ILightSwitchModule } from './../../../both/models/ILightSwitchModule';

export class LightSwitchPanel extends PanelInterfaceBase implements ILightSwitchPanel {
    _id: string;
    panelInterfaceType: PanelInterfaceType;
    name: string;
    switches: LightSwitchModule[];

    constructor(endpoint: string) {
        super(endpoint);

        if (endpoint) {
            let switchResources = DeviceConnectorService.getResourcesByObjectName(this.endpoint, ModuleType.LightSwitch.toString());
            let resByInstances: IRegistrationResource[][] = _.chain(switchResources).groupBy((res, index) => {
                return res.path.split("/")[2];
            }).toArray().value();

            this.switches = [];
            resByInstances.forEach((resources, index) => {
                let sw = <LightSwitchModule>ModuleFactory.createModuleInstanceFromResources(ModuleType.LightSwitch, endpoint, resources, index);
                sw.moduleType = ModuleType.LightSwitch;
                this.switches.push(sw);
            });
        }
    }

    subscribe() {
        this.switches.forEach(element => {
            element.subscribe();
        });
    }

    unsubscribe() {
        this.switches.forEach(element => {
            element.unsubscribe();
        });
    }

    getModuleListName(moduleType: ModuleType) {
        switch (moduleType) {
            case ModuleType.LightSwitch:
                return "switches";
        }
    }
}

PanelInterfaceBase.typeMap.set(PanelInterfaceType.LightSwitch, LightSwitchPanel);