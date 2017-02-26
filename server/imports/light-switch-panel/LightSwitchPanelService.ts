import { ILightSwitchPanel } from './../../../both/models/ILightSwitchPanel';
import { IPanelInterface, PanelInterfaceType } from './../../../both/models/IPanelInterface';
import { LightSwitchModuleService } from './../modules/light-switch-module/LightSwitchModuleService';
import { PanelInterfaceManager } from './../panel-interface/PanelInterfaceManager';

export class LightSwitchPanelService {
    constructor() {
        new LightSwitchModuleService(this.getLightSwitchModule);
    }

    getLightSwitchModule(endpoint: string, instanceId: number) {
        let pi = <ILightSwitchPanel><any>PanelInterfaceManager.getPanelInterface(endpoint, PanelInterfaceType.LightSwitch);
        return pi.switches[instanceId];
    }
}