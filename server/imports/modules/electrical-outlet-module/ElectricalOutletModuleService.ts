import { Method } from './../../core/MethodMetadata';
import { Service } from './../../core/ServiceMetadata';
import { ElectricalOutletModuleServiceBase } from './../../../../both/services/ElectricalOutletModuleServiceBase';
import { IElectricalOutletModule } from './../../../../both/models/IElectricalOutletModule';
import { IModule, ModuleType } from './../../../../both/models/IModule';

@Service
export class ElectricalOutletModuleService extends ElectricalOutletModuleServiceBase {
    getElectricalOutletModuleDelegate: (endpoint: string, instanceId: number) => IElectricalOutletModule;

    constructor(getElectricalOutletModuleDlg: (endpoint: string, instanceId: number) => IElectricalOutletModule) {
        super();
        this.getElectricalOutletModuleDelegate = <any>getElectricalOutletModuleDlg;
    }

    @Method
    setStateMethod(endpoint: string, instanceId: number, value: boolean) {
        console.log("ElectricalOutletModuleService - setStateMethod() endpoint ", endpoint, "instanceId", instanceId, "value", value);
        // TODO: validate
        let module = this.getElectricalOutletModuleDelegate(endpoint, instanceId);
        if (module) {
            module.setState(value);
        }
    }

    @Method
    setNameMethod(endpoint: string, instanceId: number, value: string) {
        console.log("LightSwitchModuleService - setNameMethod() endpoint ", endpoint, "instanceId", instanceId, "value", value);
        // TODO: validate
        let module = <IModule><any>this.getElectricalOutletModuleDelegate(endpoint, instanceId);
        if (module) {
            module.setName(value);
        }
    }
}