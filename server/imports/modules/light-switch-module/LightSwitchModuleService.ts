import { Method } from './../../core/MethodMetadata';
import { Service } from './../../core/ServiceMetadata';
import { LightSwitchModuleServiceBase } from './../../../../both/services/LightSwitchModuleServiceBase';
import { ILightSwitchModule } from './../../../../both/models/ILightSwitchModule';
import { IModule, ModuleType } from './../../../../both/models/IModule';

@Service
export class LightSwitchModuleService extends LightSwitchModuleServiceBase {
    getLightSwitchModuleDelegate: (endpoint: string, instanceId: number) => ILightSwitchModule;

    constructor(getLightSwitchModuleDlg: (endpoint: string, instanceId: number) => ILightSwitchModule) {
        super();
        this.getLightSwitchModuleDelegate = <any>getLightSwitchModuleDlg;
    }

    @Method
    setSwitchMethod(endpoint: string, instanceId: number, value: boolean) {
        console.log("LightSwitchModuleService - setSwitchMethod() endpoint ", endpoint, "instanceId", instanceId, "value", value);
        // TODO: validate
        let module = this.getLightSwitchModuleDelegate(endpoint, instanceId);
        if (module) {
            module.setSwitch(value);
        }
    }

    @Method
    setNameMethod(endpoint: string, instanceId: number, value: string) {
        console.log("LightSwitchModuleService - setNameMethod() endpoint ", endpoint, "instanceId", instanceId, "value", value);
        // TODO: validate
        let module = <IModule><any>this.getLightSwitchModuleDelegate(endpoint, instanceId);
        if (module) {
            module.setName(value);
        }
    }
}