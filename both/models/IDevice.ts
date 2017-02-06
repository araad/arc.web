export interface IDevice {
    _id: string;
    name: string;
    offline: boolean;

    endpoint: string;
    manufacturer: string;
    modelNumber: string;
    serialNumber: string;
    deviceType: string;
    panelInterfaceLoaded: boolean;
    panelInterfaceTypeId: string;

    saveName(value: string);
}