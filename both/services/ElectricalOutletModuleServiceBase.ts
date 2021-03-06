export abstract class ElectricalOutletModuleServiceBase {
    static serviceName = "ElectricalOutletModuleService";

    protected abstract setNameMethod(endpoint: string, instanceId: number, value: string, callback?: (error, result) => void);
    protected abstract setStateMethod(endpoint: string, instanceId: number, value: boolean, callback?: (error, result) => void);
    protected abstract setAlwaysOnTriggerMethod(endpoint: string, instanceId: number, value: boolean, callback?: (error, result) => void);
    protected abstract setLocationTriggerMethod(endpoint: string, instanceId: number, value: boolean, callback?: (error, result) => void);
    protected abstract cancelOutsideAreaNotificationTimeoutMethod(endpoint: string, instanceId: number);
}