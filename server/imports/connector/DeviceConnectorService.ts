import { Meteor } from 'meteor/meteor';
import { IRegistration, IRegistrationResource } from './IRegistration';
import { Registrations } from './Registrations';
import { MbedConnectorApi, EventEmitter } from './MbedConnectorApi';

interface INotification {
    ep: string;
    path: string;
    ct: string;
    payload: string;
    'max-age': number
}

interface IEndpointObject {
    name: string,
    type: string,
    status: string
}

interface IEndpointResource {
    uri: string,
    rt: string,
    type: string,
    obs: boolean
}

export namespace DeviceConnectorService {
    let api;

    let emitter = new EventEmitter();
    let loadHandlers = new Map<any, () => void>();

    export function Start(accessKey) {
        api = new MbedConnectorApi({
            accessKey: accessKey
        });

        api.on('notification', Meteor.bindEnvironment(notification => onNotificationHandler(notification)));
        api.on('registration', Meteor.bindEnvironment(registration => onRegistrationHandler(registration)));
        api.on('reg-update', Meteor.bindEnvironment(regUpdate => onRegUpdateHandler(regUpdate)));
        api.on('de-registration', Meteor.bindEnvironment(endpoint => onDeRegistrationHandler(endpoint)));
        api.on('registration-expired', Meteor.bindEnvironment(endpoint => onRegistrationExpiredHandler(endpoint)));

        api.startLongPolling(Meteor.bindEnvironment(error => startLongPollingHandler(error)));
    }

    export function on(eventType: string, eventHandler: () => void) {
        emitter.on(eventType, eventHandler);
    }

    function startLongPollingHandler(error) {
        console.log('DeviceConnectorService - startLongPolling() begin');
        if (error) {
            console.log("DeviceConnectorService - startLongPollingHandler() Error:", error);
        } else {
            console.log("DeviceConnectorService - startLongPollingHandler() Success");
            api.getEndpoints({ parameters: { type: 'arc' } },
                Meteor.bindEnvironment((err, epObjects: Array<IEndpointObject>) => getEndpointsCallback(err, epObjects)));
        }
        console.log('DeviceConnectorService - startLongPolling() end');
    }

    function getEndpointsCallback(err, epObjects: Array<IEndpointObject>) {
        console.log('DeviceConnectorService - getEndpointsCallback() begin');
        if (err) throw err;

        console.log('DeviceConnectorService - getEndpointsCallback() Found', epObjects.length, 'endpoint' + (epObjects.length === 1 ? '' : 's'));

        let regs = Registrations.find({}).fetch();
        let toRemove = <string[]>_.pluck(regs, 'ep');
        console.log('DeviceConnectorService - getEndpointsCallback() existing', toRemove);
        let toAdd = <string[]>_.pluck(epObjects, 'name');
        console.log('DeviceConnectorService - getEndpointsCallback() toAdd', toAdd);
        toRemove = _.difference(toRemove, toAdd);
        console.log('DeviceConnectorService - getEndpointsCallback() toRemove', toRemove);
        if (toRemove.length > 0) {
            Registrations.remove({ ep: { $in: toRemove } });
        }

        epObjects.forEach((epObj) => {
            
            addRegistration(epObj.name, epObj.type);
        });
        emitter.emit("load");
        console.log('DeviceConnectorService - getEndpointsCallback() end');
    }

    function addRegistration(epStr: string, epType: string) {
        console.log('DeviceConnectorService - addRegistration() begin');

        let reg = Registrations.findOne({ ep: epStr }) || <IRegistration>{};
        reg.ep = epStr;
        reg.ept = epType;
        reg.dateRegistered = new Date();
        reg.resources = getRegistrationResources(epStr);

        if (reg._id) {
            console.log('DeviceConnectorService - addRegistration() registration already exists. updating...');
            Registrations.update(reg._id, { $set: reg });
        } else {
            console.log('DeviceConnectorService - addRegistration() creating new registration...');
            Registrations.insert(reg);
        }

        console.log('DeviceConnectorService - addRegistration() end');
    }

    function getResourcesSync(epStr: string): IEndpointResource[] {
        return Meteor.wrapAsync(api.getResources, api)(epStr);
    }

    function getResourceValueSync(epStr: string, uri: string): any {
        console.log("DeviceConnectorService - getResourceValueSync() [wrapAsync]", epStr, uri);
        let result;
        try {
            result = Meteor.wrapAsync(api.getResourceValue, api)(epStr, uri);
        } catch (e) {
            console.error("DeviceConnectorService - getResourceValueSync() [ERROR]", epStr, uri, e);
        }
        return result;
    }

    function getRegistrationResources(epStr: string) {
        let epResources = getResourcesSync(epStr);

        let regResources: IRegistrationResource[] = [];

        epResources.forEach(res => {
            regResources.push(<any>{
                path: res.uri,
                value: getResourceValueSync(epStr, res.uri)
            });
        });

        return regResources;
    }

    let regMap = new Map<string, number>();

    function updateRegistration(registration: IRegistration) {
        console.log('DeviceConnectorService - updateRegistration() begin');
        let oldReg = Registrations.findOne({ ep: registration.ep });
        if (oldReg) {
            let oldTimeout = regMap.get(oldReg.ep)
            if (oldTimeout) {
                Meteor.clearTimeout(oldTimeout);
            }

            let newTimeout = Meteor.setTimeout(() => {
                regMap.delete(oldReg.ep);
                addRegistration(registration.ep, registration.ept);
            }, 2000);
            regMap.set(oldReg.ep, newTimeout);
        }
        console.log('DeviceConnectorService - updateRegistration() end');
    }

    function onNotificationHandler(notification: INotification) {
        console.log('DeviceConnectorService - onNotificationHandler() begin');
        let reg = Registrations.findOne({ ep: notification.ep });
        if (reg) {
            let res = reg.resources.find(res => _.isEqual(res.path, notification.path));
            if (res) {
                Registrations.update(
                    { ep: notification.ep, "resources.path": notification.path },
                    { $set: { "resources.$.value": notification.payload } }
                );
            }
        }
        console.log('DeviceConnectorService - onNotificationHandler() end');
    }

    function onRegistrationHandler(registration: IRegistration) {
        console.log('DeviceConnectorService - onRegistrationHandler() begin');
        // Meteor.setTimeout(() => addRegistration(registration.ep, registration.ept), 5000);
        addRegistration(registration.ep, registration.ept);
        console.log('DeviceConnectorService - onRegistrationHandler() end');
    }

    function onRegUpdateHandler(regUpdate: IRegistration) {
        console.log('DeviceConnectorService - onRegUpdateHandler() begin');
        updateRegistration(regUpdate);
        console.log('DeviceConnectorService - onRegUpdateHandler() end');
    }

    function onDeRegistrationHandler(epStr: string) {
        console.log('DeviceConnectorService - onDeRegistrationHandler() begin');
        let num = Registrations.remove({ ep: epStr });
        if (num > 0) {
            console.log("DeviceConnectorService - onDeRegistrationHandler() Removed registration: ", epStr);
        } else {
            console.log("DeviceConnectorService - onDeRegistrationHandler() Can not find registration: ", epStr);
        }
        console.log('DeviceConnectorService - onDeRegistrationHandler() end');
    }

    function onRegistrationExpiredHandler(epStr: string) {
        console.log('DeviceConnectorService - onRegistrationExpiredHandler() begin');
        let num = Registrations.remove({ ep: epStr });
        if (num > 0) {
            console.log("DeviceConnectorService - onRegistrationExpiredHandler() Removed registration: ", epStr);
        } else {
            console.log("DeviceConnectorService - onRegistrationExpiredHandler() Can not find registration: ", epStr);
        }
        console.log('DeviceConnectorService - onRegistrationExpiredHandler() end');
    }

    function getResourceValue(epStr: string, path: string, callback: (error, value) => void) {
        api.getResourceValue(epStr, path, Meteor.bindEnvironment((error, value) => callback(error, value)));
    }

    export function putResourceValue(epStr: string, path: string, value) {
        console.log('DeviceConnectorService - putResourceValue() begin');
        console.log(epStr, path, value);

        let reg = Registrations.findOne({ ep: epStr, "resources.path": path });
        Registrations.update(
            { ep: epStr, "resources.path": path },
            { $set: { "resources.$.value": value } }
        );
        reg = Registrations.findOne({ ep: epStr, "resources.path": path });
        Meteor.setTimeout(() => api.putResourceValue(epStr, path, value), 0);
        console.log('DeviceConnectorService - putResourceValue() end');
    }

    export function postResource(epStr: string, path: string, value) {
        api.postResource(epStr, path, value);
    }

    export function putResourceSubscription(epStr: string, path: string) {
        console.log('DeviceConnectorService - putResourceSubscription() begin');
        console.log('DeviceConnectorService - putResourceSubscription() subscribing to', epStr, path);
        api.getResourceSubscription(epStr, path, Meteor.bindEnvironment((error, subscribed) => {
            if (error) throw new Error(error);

            if (!subscribed) {
                api.putResourceSubscription(epStr, path);
            } else {
                console.log("DeviceConnectorService - putResourceSubscription() ****  already subscribed to ", path, " ****");
            }
        }));
        console.log('DeviceConnectorService - putResourceSubscription() end');
    }

    export function deleteResourceSubscription(epStr: string, path: string) {
        console.log('DeviceConnectorService - deleteResourceSubscription() begin');
        console.log('DeviceConnectorService - deleteResourceSubscription() unsubscribing from', epStr, path);
        api.deleteResourceSubscription(epStr, path);
        console.log('DeviceConnectorService - deleteResourceSubscription() end');
    }

    export function getResourcesByObjectName(epStr: string, name: string) {
        console.log('DeviceConnectorService - getResourcesByObjectName() begin');
        let reg = Registrations.findOne({ ep: epStr });
        if (reg) {
            let key = "/" + name;
            let result = reg.resources.filter(res => res.path.startsWith(key));
            console.log('DeviceConnectorService - getResourcesByObjectName() end');
            return result;
        } else {
            console.log("DeviceConnectorService - getResourcesByObjectName() registration not found", epStr);
        }
        console.log('DeviceConnectorService - getResourcesByObjectName() end');
    }

    // function getResourcesCallback(err, epStr: string, epResources: Array<IEndpointResource>) {
    //     console.log('DeviceConnectorService - getResourcesCallback() begin');
    //     if (epResources) {
    //         let deviceResources = epResources.filter(res => res.uri.startsWith("/3/") || res.uri.startsWith("/dev/"));
    //         let customResources = _.difference(epResources, deviceResources);
    //         deviceResources.forEach(epRes => {
    //             api.getResourceValue(
    //                 epStr,
    //                 epRes.uri,
    //                 Meteor.bindEnvironment(
    //                     (error, value) => getResourceValueCallback(error, epStr, value, epRes)
    //                 )
    //             );
    //         });
    //         customResources.forEach(epRes => {
    //             api.getResourceValue(
    //                 epStr,
    //                 epRes.uri,
    //                 Meteor.bindEnvironment(
    //                     (error, value) => getResourceValueCallback(error, epStr, value, epRes)
    //                 )
    //             );
    //         });
    //     } else {
    //         console.warn("resources empty");
    //     }
    //     console.log('DeviceConnectorService - getResourcesCallback() end');
    // }

    // function getResourceValueCallback(error, epStr: string, value, epRes: IEndpointResource) {
    //     console.log('DeviceConnectorService - getResourceValueCallback() begin', epRes.uri);
    //     let reg = Registrations.findOne({ ep: epStr });
    //     if (reg) {
    //         let oldRes = reg.resources.find(res => _.isEqual(res.path, epRes.uri));
    //         if (oldRes) {
    //             if (!_.isEqual(oldRes.value, value)) {
    //                 Registrations.update(
    //                     { ep: epStr, "resources.path": oldRes.path },
    //                     { $set: { "resources.$.value": value } }
    //                 );
    //             }
    //         } else {
    //             Registrations.update(
    //                 { ep: epStr },
    //                 { $push: { resources: { path: epRes.uri, value: value } } }
    //             );
    //         }
    //     }
    //     console.log('DeviceConnectorService - getResourceValueCallback() end');
    // }
}