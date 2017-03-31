export enum PanelInterfaceType {
    None = 0,
    ElectricalOutlet,
    MotionDetector,
    LightSwitch
}

export interface IPanelInterface {
    _id: string;
    panelInterfaceType: PanelInterfaceType;
    name: string;
}