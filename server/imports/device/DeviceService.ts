import { Method } from './../core/MethodMetadata';
import { Service } from './../core/ServiceMetadata';
import { DeviceServiceBase } from './../../../both/services/DeviceServiceBase';
import { IDevice } from './../../../both/models/IDevice';

@Service
export class DeviceService extends DeviceServiceBase {
    getDeviceDelegate: (id: string) => IDevice;

    constructor(getDeviceDlg: (id: string) => IDevice) {
        super();

        this.getDeviceDelegate = getDeviceDlg;
    }

    @Method
    saveNameMethod(id: string, value: string) {
        console.log("DeviceService - saveNameMethod() begin");
        // TODO: validate
        let device = this.getDeviceDelegate(id);
        if (device) {
            device.saveName(value);
        }
        console.log("DeviceService - saveNameMethod() end");
    }

    @Method
    geotagMethod(id: string, value: any) {
        console.log("DeviceService - geotagMethod() begin");
        // TODO: validate
        let device = this.getDeviceDelegate(id);
        if (device) {
            device.geotag(value);
        }
        console.log("DeviceService - geotagMethod() end");
    }

    @Method
    callSysHangSimMethod(id: string) {
        console.log("DeviceService - callSysHangSim() begin");
        // TODO: validate
        console.log(this);
        let device = this.getDeviceDelegate(id);
        if (device) {
            device.callSysHangSim();
        }
        console.log("DeviceService - callSysHangSim() end");
    }
}