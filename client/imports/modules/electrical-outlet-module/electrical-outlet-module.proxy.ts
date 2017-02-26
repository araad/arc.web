import { ElectricalOutletModuleServiceBase } from './../../../../both/services/ElectricalOutletModuleServiceBase';
import { IElectricalOutletModule } from './../../../../both/models/IElectricalOutletModule';
import { IModule } from './../../../../both/models/IModule';
import { Method } from './../../core/MethodMetadata';

export class ElectricalOutletModuleProxy extends ElectricalOutletModuleServiceBase implements IElectricalOutletModule, IModule {
    name: string;
    moduleType: number;
    instanceId: number;
    endpoint: string;

    state: boolean;
    measuredCurrent: number;

    constructor(doc: IElectricalOutletModule) {
        super();

        for (var key in doc) {
            this[key] = doc[key];
        }
    }

    @Method
    protected setStateMethod(endpoint: string, instanceId: number, value: boolean, callback: (error, result) => void) { }

    public setState(value: boolean) {
        if (this.state !== value) {
            this.setStateMethod(this.endpoint, this.instanceId, value, (error, result) => this.onSetState(error, result));
        }
    }

    @Method
    protected setNameMethod(endpoint: string, instanceId: number, value: string, callback: (error, result) => void) { }

    public setName(value: string) {
        this.setNameMethod(this.endpoint, this.instanceId, value, (error, result) => this.onSetName(error, result));
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
}