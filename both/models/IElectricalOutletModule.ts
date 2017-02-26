export interface IElectricalOutletModule {
    state: boolean;
    setState(value: boolean);
    measuredCurrent: number;
}