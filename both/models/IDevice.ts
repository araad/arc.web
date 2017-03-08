export interface IDevice {
    _id: string;
    name: string;
    offline: boolean;

    manufacturer: string;
    modelNumber: string;
    serialNumber: string;
    deviceType: string;
    panelInterfaceType: number;
    panelInterface_id: string;

    saveName(value: string);
    callSysHangSim();
}