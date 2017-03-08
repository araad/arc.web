export abstract class DeviceServiceBase {
    static serviceName = "DeviceService";

    abstract saveNameMethod(id: string, value: string, callback?: (error, result) => void);
    abstract callSysHangSimMethod(id: string, callback?: (error, result) => void);
}