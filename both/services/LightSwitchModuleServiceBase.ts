export abstract class LightSwitchModuleServiceBase {
    static serviceName = "LightSwitchModuleService";

    protected abstract setNameMethod(endpoint: string, instanceId: number, value: string, callback?: (error, result) => void);
    protected abstract setSwitchMethod(endpoint: string, instanceId: number, value: boolean, callback?: (error, result) => void);
}