import { IRegistrationResource } from './IRegistration';

export interface IResourceManager {
    endpoint: string;

    subscribe();
    unsubscribe();
    setField(res: IRegistrationResource);
    setResource(name: string, value);
}