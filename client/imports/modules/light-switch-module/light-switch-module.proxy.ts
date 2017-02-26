import { LightSwitchModuleServiceBase } from './../../../../both/services/LightSwitchModuleServiceBase';
import { ILightSwitchModule } from './../../../../both/models/ILightSwitchModule';
import { IModule } from './../../../../both/models/IModule';
import { Method } from './../../core/MethodMetadata';

export class LightSwitchModuleProxy extends LightSwitchModuleServiceBase implements ILightSwitchModule, IModule {
    name: string;
    switch: boolean;
    moduleType: number;
    instanceId: number;
    endpoint: string;

    constructor(doc: ILightSwitchModule) {
        super();

        for (var key in doc) {
            this[key] = doc[key];
        }
    }

    @Method
    protected setSwitchMethod(endpoint: string, instanceId: number, value: boolean, callback: (error, result) => void) { }

    public setSwitch(value: boolean) {
        if (this.switch !== value) {
            this.setSwitchMethod(this.endpoint, this.instanceId, value, (error, result) => this.onSetSwitch(error, result));
        }
    }

    @Method
    protected setNameMethod(endpoint: string, instanceId: number, value: string, callback: (error, result) => void) { }

    public setName(value: string) {
        this.setNameMethod(this.endpoint, this.instanceId, value, (error, result) => this.onSetName(error, result));
    }

    private onSetSwitch(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log('success', result);
        }
    }

    private onSetName(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log('success', result);
        }
    }
}