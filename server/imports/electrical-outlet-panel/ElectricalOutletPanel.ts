import { PanelInterfaceType } from './../../../both/models/IPanelInterface';
import { IElectricalOutletPanel } from './../../../both/models/IElectricalOutletPanel';
import { IRegistrationResource } from './../connector/IRegistration';
import { DeviceConnectorService } from './../connector/DeviceConnectorService';
import { PanelInterfaceBase } from './../panel-interface/PanelInterfaceBase';
import { ModuleType } from './../../../both/models/IModule';
import { ModuleFactory } from './../modules/ModuleFactory';
import { ElectricalOutletModule } from './../modules/electrical-outlet-module/ElectricalOutletModule';

ElectricalOutletModule;

import { IElectricalOutletModule } from './../../../both/models/IElectricalOutletModule';

export class ElectricalOutletPanel extends PanelInterfaceBase implements IElectricalOutletPanel {
    _id: string;
    panelInterfaceType: PanelInterfaceType;
    name: string;
    outlets: ElectricalOutletModule[];

    constructor(endpoint: string) {
        super(endpoint);

        if (endpoint) {
            let switchResources = DeviceConnectorService.getResourcesByObjectName(this.endpoint, ModuleType.ElectricalOutlet.toString());
            let resByInstances: IRegistrationResource[][] = _.chain(switchResources).groupBy((res, index) => {
                return res.path.split("/")[2];
            }).toArray().value();

            this.outlets = [];
            resByInstances.forEach((resources, index) => {
                let outlet = <ElectricalOutletModule>ModuleFactory.createModuleInstanceFromResources(ModuleType.ElectricalOutlet, endpoint, resources, index);
                outlet.moduleType = ModuleType.ElectricalOutlet;
                this.outlets.push(outlet);
            });
        }
    }

    subscribe() {
        this.outlets.forEach(element => {
            element.subscribe();
        });
    }

    unsubscribe() {
        this.outlets.forEach(element => {
            element.unsubscribe();
        });
    }

    getModuleListName(moduleType: ModuleType) {
        switch (moduleType) {
            case ModuleType.ElectricalOutlet:
                return "outlets";
        }
    }
}

PanelInterfaceBase.typeMap.set(PanelInterfaceType.ElectricalOutlet, ElectricalOutletPanel);