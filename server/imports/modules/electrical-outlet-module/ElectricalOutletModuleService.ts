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
        console.log("ElectricalOutletModuleService - setNameMethod() endpoint ", endpoint, "instanceId", instanceId, "value", value);
        // TODO: validate
        let module = <IModule><any>this.getElectricalOutletModuleDelegate(endpoint, instanceId);
        if (module) {
            module.setName(value);
        }
    }

    @Method
    setAlwaysOnTriggerMethod(endpoint: string, instanceId: number, value: boolean) {
        console.log("ElectricalOutletModuleService - setAlwaysOnTriggerMethod() endpoint ", endpoint, "instanceId", instanceId, "value", value);
        // TODO: validate
        let module = <IElectricalOutletModule><any>this.getElectricalOutletModuleDelegate(endpoint, instanceId);
        if (module) {
            module.setAlwaysOnTrigger(value);
        }
    }

    @Method
    setLocationTriggerMethod(endpoint: string, instanceId: number, value: boolean) {
        console.log("ElectricalOutletModuleService - setLocationTriggerMethod() endpoint ", endpoint, "instanceId", instanceId, "value", value);
        // TODO: validate
        let module = <IElectricalOutletModule><any>this.getElectricalOutletModuleDelegate(endpoint, instanceId);
        if (module) {
            module.setLocationTrigger(value);
        }
    }

    @Method
    cancelOutsideAreaNotificationTimeoutMethod(endpoint: string, instanceId: number) {
        console.log("ElectricalOutletModuleService - cancelOutsideAreaNotificationTimeoutMethod() endpoint ", endpoint, "instanceId", instanceId);
        // TODO: validate
        let module = <IElectricalOutletModule><any>this.getElectricalOutletModuleDelegate(endpoint, instanceId);
        if (module) {
            module.cancelOutsideAreaNotificationTimeout();
        }
    }
}