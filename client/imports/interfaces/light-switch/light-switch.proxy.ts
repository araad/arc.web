import { ILightSwitchPanel } from './../../../../both/models/ILightSwitchPanel';
import { ILightSwitchModule } from './../../../../both/models/ILightSwitchModule';
import { LightSwitchModuleProxy } from './../../modules/light-switch-module/light-switch-module.proxy';
import { Method } from './../../core/MethodMetadata';

export class LightSwitchProxy implements ILightSwitchPanel {
    _id: string;
    name: string;
    switches: ILightSwitchModule[];

    constructor(doc: ILightSwitchPanel) {
        for (var key in doc) {
            let val = doc[key];
            if (Array.isArray(val)) {
                let arr = [];
                val.forEach(element => {
                    arr.push(new LightSwitchModuleProxy(element));
                });
                val = arr;
            } else if (_.isObject(val)) {
                val = new LightSwitchModuleProxy(val);
            }

            this[key] = val;
        }
    }
}