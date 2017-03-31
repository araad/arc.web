export interface IElectricalOutletModule {
    state: boolean;
    setState(value: boolean);
    powerConsumed: number;
    alwaysOnTrigger: boolean;
    setAlwaysOnTrigger(value: boolean);
    locationTrigger: boolean;
    setLocationTrigger(value: boolean, callback?: (error, result) => void);
    sendOutsideAreaNotificationTimeout?: number;
    cancelOutsideAreaNotificationTimeout();
}