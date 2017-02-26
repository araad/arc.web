import { Method } from './../core/MethodMetadata';
import { Service } from './../core/ServiceMetadata';
import { TestPanelServiceBase } from './../../../both/services/TestPanelServiceBase';
import { ITestPanel } from './../../../both/models/ITestPanel';
import { IPanelInterface } from './../../../both/models/IPanelInterface';
import { PanelInterfaceManager } from './../panel-interface/PanelInterfaceManager';

@Service
export class TestPanelService extends TestPanelServiceBase {

    @Method
    setLightSwitchMethod(id: string, value: boolean) {
        console.log("TestPanelService - setLightSwitchMethod() id ", id, "value", value);
        // TODO: validate
        let test;
        if (test) {
            test.setLightSwitch(value);
        }
    }
}