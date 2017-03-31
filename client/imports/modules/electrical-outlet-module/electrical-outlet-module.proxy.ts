import { ElectricalOutletModuleServiceBase } from './../../../../both/services/ElectricalOutletModuleServiceBase';
import { IElectricalOutletModule } from './../../../../both/models/IElectricalOutletModule';
import { IModule } from './../../../../both/models/IModule';
import { Method } from './../../core/MethodMetadata';

export class ElectricalOutletModuleProxy extends ElectricalOutletModuleServiceBase implements IElectricalOutletModule, IModule {
    name: string;
    moduleType: number;
    instanceId: number;
    endpoint: string;
    alwaysOnTrigger: boolean;
    locationTrigger: boolean;

    state: boolean;
    powerConsumed: number;

    constructor(doc: IElectricalOutletModule) {
        super();

        for (var key in doc) {
            this[key] = doc[key];
        }
    }

    @Method
    protected setStateMethod(endpoint: string, instanceId: number, value: boolean, callback: (error, result) => void) { }

    public setState(value: boolean) {
        this.setStateMethod(this.endpoint, this.instanceId, value, (error, result) => this.onSetState(error, result));
    }

    @Method
    protected setNameMethod(endpoint: string, instanceId: number, value: string, callback: (error, result) => void) { }

    public setName(value: string) {
        this.setNameMethod(this.endpoint, this.instanceId, value, (error, result) => this.onSetName(error, result));
    }

    @Method
    protected setAlwaysOnTriggerMethod(endpoint: string, instanceId: number, value: boolean, callback: (error, result) => void) { }

    public setAlwaysOnTrigger(value: boolean) {
        this.setAlwaysOnTriggerMethod(this.endpoint, this.instanceId, value, (error, result) => this.onSetAlwaysOnTrigger(error, result));
    }

    @Method
    protected setLocationTriggerMethod(endpoint: string, instanceId: number, value: boolean, callback: (error, result) => void) { }

    public setLocationTrigger(value: boolean, callback: (error, result) => void) {
        this.setLocationTriggerMethod(this.endpoint, this.instanceId, value, (error, result) => callback(error, result));
    }

    @Method
    protected cancelOutsideAreaNotificationTimeoutMethod(endpoint: string, instanceId: number) { }

    public cancelOutsideAreaNotificationTimeout() {
        this.cancelOutsideAreaNotificationTimeoutMethod(this.endpoint, this.instanceId);
    }

    private onSetState(error, result) {
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

    private onSetAlwaysOnTrigger(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log('success', result);
        }
    }

    private onSetLocationTrigger(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log('success', result);
        }
    }
}