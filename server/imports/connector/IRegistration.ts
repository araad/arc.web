export interface IRegistration {
    _id: string;
    ep: string;
    ept: string;
    resources: Array<IRegistrationResource>;
}

export interface IRegistrationResource {
    path: string;
    rt: string;
    ct: string;
    obs: boolean;
    value: any;
}