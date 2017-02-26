import { Meteor } from 'meteor/meteor';
import { ServiceManager } from './ServiceManager';

export function Method(target: any, key: string, descriptor: any) {
    checkServiceName(target.constructor);

    let methodConfig = {},
        methodKey = `${target.constructor.serviceName}.${key}`;

    // Register the method as a Meteor Method
    methodConfig[methodKey] = function (...args: any[]) {
        let instance = ServiceManager.getService(target.constructor.serviceName);
        instance.methodObject = this;
        (<Function>descriptor.value).call(instance, ...args);
    };
    Meteor.methods(methodConfig);

    return descriptor;
}

function checkServiceName(constructor: any) {
    // Throw an error if the model does not have a static property for serviceName defined
    if (!constructor.serviceName) {
        throw new Error(`ServerMethodMetadata.ts: ServerMethod() - Could not find static property 'serviceName' on ${constructor.name}`)
    }
}