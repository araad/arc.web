export enum PanelInterfaceType {
    None = 0,
    Test,
    LightSwitch,
    ElectricalOutlet
}

export interface IPanelInterface {
    _id: string;
    panelInterfaceType: PanelInterfaceType;
    name: string;
}