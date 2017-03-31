export interface IDevice {
    _id: string;
    name: string;
    offline: boolean;
    coords: Coordinates;

    manufacturer: string;
    modelNumber: string;
    serialNumber: string;
    deviceType: string;
    panelInterfaceType: number;
    panelInterface_id: string;

    saveName(value: string);
    geotag(value: Coordinates);
    callSysHangSim();
}