import {Meteor} from 'meteor/meteor';

export function Publication(target: any, key: string, descriptor: any) {

    let publicationKey = getPublicationName(key);

    Meteor.publish(publicationKey, descriptor.value);

    return descriptor;
}

function getPublicationName(name: string) {
    // Throw an error if the publication name is invalid
    if (name === null || name === undefined || typeof name !== 'string' || name === '' || name.indexOf('publish') === -1) {
        throwPublicationError(name);
    }

    let nameParts = name.split('publish');
    
    if(nameParts.length !== 2 || nameParts[1].length < 3) {
        throwPublicationError(name);
    }
    
    return nameParts[1].charAt(0).toLowerCase() + nameParts[1].slice(1);
}

function throwPublicationError(name: string) {
    throw new Error(`PublicationMetadata.ts: Publication() - Publication name is invalid ${name}`);
}