import { Registrations } from './../connector/Registrations';
import { IRegistration, IRegistrationResource } from './../connector/IRegistration';
import { PanelInterfaceBase } from './PanelInterfaceBase';
import { PanelInterfaceFactory } from './PanelInterfaceFactory';
import { IPanelInterface } from './../../../both/models/IPanelInterface';
import { PanelInterfaces } from './../../../both/collections/panel-interface.collection';
import { PanelInterfaceManager } from './../panel-interface/PanelInterfaceManager';
import { Mongo } from 'meteor/mongo';

export class PanelInterfaceObserver {
    constructor() {
        PanelInterfaces.collection.find({}).observe({
            added: (pi: PanelInterfaceBase) => this.piAdded(pi),
            removed: (pi: PanelInterfaceBase) => this.piRemoved(pi)
        });
    }

    piAdded(pi: PanelInterfaceBase) {
        console.log("PanelInterfaceObserver - piAdded() begin");
        pi = PanelInterfaceFactory.createPanel(pi.panelInterfaceType, pi.endpoint);
        pi.subscribe();
        console.log("PanelInterfaceObserver - piAdded() end");
    }

    piRemoved(pi: PanelInterfaceBase) {
        console.log("PanelInterfaceObserver - piRemoved() begin");
        pi = PanelInterfaceFactory.createPanel(pi.panelInterfaceType, pi.endpoint);
        pi.unsubscribe();
        console.log("PanelInterfaceObserver - piRemoved() end");
    }
}