export abstract class TestPanelServiceBase {
    static serviceName = "TestPanelService";

    abstract setLightSwitchMethod(id: string, value: boolean, callback?: (error, result) => void);
}