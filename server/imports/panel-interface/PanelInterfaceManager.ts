import { IRegistrationResource } from './../connector/IRegistration';
import { IPanelInterface, PanelInterfaceType } from './../../../both/models/IPanelInterface';
import { PanelInterfaceBase } from './PanelInterfaceBase';
import { PanelInterfaceFactory } from './PanelInterfaceFactory';
import { DeviceConnectorService } from './../connector/DeviceConnectorService';
import { PanelInterfaces } from './../../../both/collections/panel-interface.collection';
import { PanelInterfacePublications } from './PanelInterfacePublications';
import { PanelInterfaceObserver } from './PanelInterfaceObserver';
import { IResourceManager } from './../connector/IResourceManager';
import { IModule, ModuleType } from './../../../both/models/IModule';
import { ModuleFactory } from './../modules/ModuleFactory';

import { ElectricalOutletPanel } from './../electrical-outlet-panel/ElectricalOutletPanel';
import { LightSwitchPanel } from './../light-switch-panel/LightSwitchPanel';
import { TestPanel } from './../test-panel/TestPanel';

ElectricalOutletPanel; LightSwitchPanel; TestPanel;

export namespace PanelInterfaceManager {
    let serviceTypes: Array<any>;

    export function start() {
        new PanelInterfaceObserver();
        new PanelInterfacePublications();
    }

    export function getPanelInterface(endpoint: string, type: PanelInterfaceType) {
        console.log("PanelInterfaceManager - getPanelInterfaceFromDevice() begin");
        let pi = <PanelInterfaceBase>PanelInterfaces.collection.findOne({ endpoint: endpoint, panelInterfaceType: type }, {
            transform: (doc) => {
                return PanelInterfaceFactory.createFromDoc(doc);
            }
        });
        console.log("PanelInterfaceManager - getPanelInterfaceFromDevice() end");
        return pi;
    }

    function unloadPanelInterface(endpoint: string, type: PanelInterfaceType) {
        console.log("PanelInterfaceManager - unloadPanelInterface() begin");
        let pi = <PanelInterfaceBase>PanelInterfaces.collection.findOne(
            { endpoint: endpoint, panelInterfaceType: type },
            {
                transform: (doc) => {
                    return PanelInterfaceFactory.createFromDoc(doc);
                }
            }
        );
        console.log(type);
        if (pi) {
            pi.unsubscribe();
        } else {
            console.log("PanelInterfaceManager - unloadPanelInterface() panel interface is null");
        }
        console.log("PanelInterfaceManager - unloadPanelInterface() end");
    }

    function loadPanelInterface(endpoint: string, type: PanelInterfaceType) {
        console.log("PanelInterfaceManager - loadPanelInterface() begin");

        let pi = <PanelInterfaceBase>PanelInterfaces.collection.findOne({ endpoint: endpoint, panelInterfaceType: type }, {
            transform: (doc) => PanelInterfaceFactory.createFromDoc(doc)
        });

        if (!pi) {
            console.log("PanelInterfaceManager - loadPanelInterface() creating panel");
            pi = PanelInterfaceFactory.createPanel(type, endpoint);
            if (pi) {
                pi.name = "Panel";
                pi.panelInterfaceType = type;
                pi._id = PanelInterfaces.collection.insert(pi);
            }
        }

        if (pi) {
            pi.subscribe();
        }

        console.log("PanelInterfaceManager - loadPanelInterface() end");
        return pi ? pi._id : null;
    }

    export function changePanelInterface(endpoint: string, newType: PanelInterfaceType, oldType: PanelInterfaceType): string {
        console.log("PanelInterfaceManager - changePanelInterface() begin");
        console.log("PanelInterfaceManager - changePanelInterface() newType", newType, "oldType", oldType);

        let piId: string;

        if (oldType > 0 && oldType !== newType) {
            unloadPanelInterface(endpoint, oldType);
        }

        if (newType > 0) {
            piId = loadPanelInterface(endpoint, newType);
        }

        console.log("PanelInterfaceManager - changePanelInterface() end");
        return piId;
    }

    export function syncPanel(endpoint: string, panelInterfaceId: string, piType: PanelInterfaceType, res: IRegistrationResource) {
        console.log("PanelInterfaceManager - syncPanel() begin");

        let pathParts = res.path.split('/');
        let moduleType = <ModuleType>parseInt(pathParts[1]);
        let instanceId = parseInt(pathParts[2]);
        let resourceType = parseInt(pathParts[3]);

        let module = ModuleFactory.createModuleInstanceFromResources(moduleType, endpoint, [res], instanceId);
        let pi = PanelInterfaceFactory.createPanel(piType);
        let listName = pi.getModuleListName(moduleType);
        let fieldName = module.getFieldName(resourceType);

        let selector = <any>{ endpoint: endpoint };
        let moduleSelector = listName + ".instanceId";
        selector[moduleSelector] = instanceId;
        console.log('selector', selector);

        let modifier = { $set: <any>{} };
        let moduleModifier = listName + ".$." + fieldName;
        modifier.$set[moduleModifier] = module[fieldName];
        console.log('modifier', modifier);

        PanelInterfaces.collection.update(selector, modifier);

        console.log("PanelInterfaceManager - syncPanel() end");
    }
}