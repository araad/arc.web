import { IElectricalOutletPanel } from './../../../both/models/IElectricalOutletPanel';
import { IPanelInterface, PanelInterfaceType } from './../../../both/models/IPanelInterface';
import { ElectricalOutletModuleService } from './../modules/electrical-outlet-module/ElectricalOutletModuleService';
import { PanelInterfaceManager } from './../panel-interface/PanelInterfaceManager';

export class ElectricalOutletPanelService {
    constructor() {
        new ElectricalOutletModuleService(this.getElectricalOutletModule);
    }

    getElectricalOutletModule(endpoint: string, instanceId: number) {
        let pi = <IElectricalOutletPanel><any>PanelInterfaceManager.getPanelInterface(endpoint, PanelInterfaceType.ElectricalOutlet);
        return pi.outlets[instanceId];
    }
}