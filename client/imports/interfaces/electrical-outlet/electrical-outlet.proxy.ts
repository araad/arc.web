import { IElectricalOutletPanel } from './../../../../both/models/IElectricalOutletPanel';
import { IElectricalOutletModule } from './../../../../both/models/IElectricalOutletModule';
import { ElectricalOutletModuleProxy } from './../../modules/electrical-outlet-module/electrical-outlet-module.proxy';
import { Method } from './../../core/MethodMetadata';

export class ElectricalOutletProxy implements IElectricalOutletPanel {
    _id: string;
    name: string;
    outlets: IElectricalOutletModule[];

    constructor(doc: IElectricalOutletPanel) {
        for (var key in doc) {
            let val = doc[key];
            if (Array.isArray(val)) {
                let arr = [];
                val.forEach(element => {
                    arr.push(new ElectricalOutletModuleProxy(element));
                });
                val = arr;
            } else if (_.isObject(val)) {
                val = new ElectricalOutletModuleProxy(val);
            }

            this[key] = val;
        }
    }
}