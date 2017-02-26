import { IModule, ModuleType } from './../../../both/models/IModule';
import { IRegistrationResource } from './../connector/IRegistration';
import { IResourceManager } from './../connector/IResourceManager';

export abstract class ModuleBase implements IModule, IResourceManager {
    instanceId: number;
    moduleType: ModuleType;
    name: string;
    endpoint: string;

    constructor(endpoint: string, instanceId: number) {
        this.endpoint = endpoint;
        this.instanceId = instanceId;
    }

    abstract subscribe();
    abstract unsubscribe();
    abstract setField(res: IRegistrationResource);
    abstract setResource(name: string, value);
    abstract setName(value: string);
    abstract getFieldName(resourceType: number);

    static typeMap = new Map<ModuleType, any>();
}