import {Meteor} from 'meteor/meteor';

export function Method(target: any, key: string, descriptor: any) {

    checkModelName(target.constructor);

    let methodKey = `${target.constructor.serviceName}.${key}`,
        originalValue = descriptor.value;
        
    // Modify the function to call the Meteor Method that will in turn call the actual function
    descriptor.value = function(...args: any[]) {
        originalValue.call(this, ...args);
        console.log(`Calling method: ${methodKey}`);
        return Meteor.call(methodKey, ...args);
    }

    return descriptor;
}

function checkModelName(constructor: any) {
    // Throw an error if the model does not have a static property for serviceName defined
    if (!constructor.serviceName) {
        throw new Error(`MethodMetadata.ts: Method() - Could not find static property 'serviceName' on ${constructor.name}`)
    }
}