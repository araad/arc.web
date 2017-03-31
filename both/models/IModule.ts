export enum ModuleType {
    NightLight = 4343,
    LightSwitch = 3311,
    ElectricalOutlet = 3312,
    USBPort = 3201,
    MotionDetector = 3302,
}

export interface IModule {
    moduleType: ModuleType;
    name: string;
    instanceId: number;

    setName(value: string);
}