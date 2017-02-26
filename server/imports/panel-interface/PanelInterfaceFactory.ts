import { PanelInterfaceBase } from './PanelInterfaceBase';
import { IPanelInterface, PanelInterfaceType } from './../../../both/models/IPanelInterface';
import { IRegistrationResource } from './../connector/IRegistration';
import { ModuleFactory } from './../modules/ModuleFactory';

export namespace PanelInterfaceFactory {
    export function createPanel(typeId: PanelInterfaceType, endpoint?: string) {
        console.log("PanelInterfaceFactory - createPanel() begin");
        let type = PanelInterfaceBase.typeMap.get(typeId);
        let pi: PanelInterfaceBase = null;

        if (type) {
            pi = new type(endpoint);
        }

        console.log("PanelInterfaceFactory - createPanel() end");
        return pi;
    }

    export function createFromDoc(doc: IPanelInterface) {
        console.log("PanelInterfaceFactory - createFromDoc() begin");

        let type = PanelInterfaceBase.typeMap.get(doc.panelInterfaceType);
        let pi: PanelInterfaceBase = null;

        if (type) {
            pi = new type();

            for (var key in doc) {
                let val = doc[key];
                if (Array.isArray(val)) {
                    let arr = [];
                    val.forEach(element => {
                        arr.push(ModuleFactory.createModuleInstanceFromDoc(element));
                    });
                    val = arr;
                } else if (_.isObject(val)) {
                    val = ModuleFactory.createModuleInstanceFromDoc(val);
                }

                pi[key] = val;
            }
        }

        console.log("PanelInterfaceFactory - createFromDoc() end");
        return pi;
    }
}
