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
        // TODO: validate
        let device = this.getDeviceDelegate(id);
        if (device) {
            device.saveName(value);
        }
    }
}