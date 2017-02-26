import { IPanelInterface, PanelInterfaceType } from './../../../both/models/IPanelInterface';
import { IRegistrationResource } from './../connector/IRegistration';
import { IResourceManager } from './../connector/IResourceManager';

export abstract class PanelInterfaceBase implements IPanelInterface {
    _id: string;
    panelInterfaceType: PanelInterfaceType;
    name: string;
    endpoint: string;

    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    abstract subscribe();
    abstract unsubscribe();
    abstract getModuleListName(moduleType: number);

    static typeMap = new Map<PanelInterfaceType, any>();
}