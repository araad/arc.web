import { ModuleBase } from './ModuleBase';
import { IModule, ModuleType } from './../../../both/models/IModule';
import { IRegistrationResource } from './../connector/IRegistration';

export namespace ModuleFactory {
    export function createModuleInstance(typeId: ModuleType) {
        let type = ModuleBase.typeMap.get(typeId);
        let pi: ModuleBase = null;

        if (type) {
            pi = new type();
        }

        return pi;
    }

    export function createModuleInstanceFromDoc(doc: IModule) {
        console.log("ModuleFactory - createModuleInstanceFromDoc() begin");

        let type = ModuleBase.typeMap.get(doc.moduleType);
        let pi: ModuleBase = null;

        if (type) {
            pi = new type();

            for (var key in doc) {
                pi[key] = doc[key];
            }
        }

        console.log("ModuleFactory - createModuleInstanceFromDoc() end");
        return pi;
    }

    export function createModuleInstanceFromResources(typeId: ModuleType, endpoint: string, resources: IRegistrationResource[], instanceId = 0) {
        console.log("ModuleFactory - createModuleInstanceFromResources() begin");
        let type = ModuleBase.typeMap.get(typeId);
        let mod: ModuleBase = null;

        if (type) {
            console.log("creating new instance");
            mod = new type(endpoint, instanceId);
            mod.moduleType = typeId;

            resources.forEach(res => {
                mod.setField(res);
            });
        } else {
            console.log("type is null");
        }

        console.log("ModuleFactory - createModuleInstanceFromResources() end");
        return mod;
    }
}
