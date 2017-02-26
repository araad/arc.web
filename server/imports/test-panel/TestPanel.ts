import { PanelInterfaceType } from './../../../both/models/IPanelInterface';
import { ITestPanel } from './../../../both/models/ITestPanel';
import { IRegistrationResource } from './../connector/IRegistration';
import { DeviceConnectorService } from './../connector/DeviceConnectorService';
import { PanelInterfaceBase } from './../panel-interface/PanelInterfaceBase';

export class TestPanel extends PanelInterfaceBase implements ITestPanel {
    _id: string;
    panelInterfaceType: PanelInterfaceType;
    name: string;
    endpoint: string;
    lightSwitch: boolean;

    subscribe() {
        DeviceConnectorService.putResourceSubscription(this.endpoint, "/test/0/light");
    }

    unsubscribe() {
        DeviceConnectorService.deleteResourceSubscription(this.endpoint, "/test/0/light");
    }

    setLightSwitch(value: boolean) {
        console.log("TestPanel - setLightSwitch() new value", value);
        this.setResource("light", value);
    }

    setField(res: IRegistrationResource) {
        if (_.isEqual(typeof res.value, "string")) {
            let pathParts = res.path.split('/');
            if (_.isEqual(pathParts[1], 'test') && _.isEqual(pathParts[3], 'light')) {
                this.lightSwitch = !!parseInt(res.value);
            }
        }
    }

    setResource(name: string, value) {
        let path = "/test/0/" + name;
        value = value ? '1' : '0';
        DeviceConnectorService.putResourceValue(this.endpoint, path, value);
    }
}

PanelInterfaceBase.typeMap.set(PanelInterfaceType.Test, TestPanel);