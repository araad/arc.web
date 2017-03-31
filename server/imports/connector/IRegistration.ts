export interface IRegistration {
    _id: string;
    ep: string;
    ept: string;
    dateRegistered: Date;
    regTimeout: number;
    resources: Array<IRegistrationResource>;
}

export interface IRegistrationResource {
    path: string;
    rt: string;
    ct: string;
    obs: boolean;
    value: any;
}