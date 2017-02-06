import { Meteor } from 'meteor/meteor';
import { IRegistration, IRegistrationResource } from './IRegistration';
import { Registrations } from './Registrations';
import { MbedConnectorApi } from './MbedConnectorApi';

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

    function startLongPollingHandler(error) {
        console.log('DeviceConnectorService - startLongPolling()');
        if (error) {
            console.log("Error: ");
            console.log(error);
        } else {
            console.log("Success");
            api.getEndpoints({ parameters: { type: 'test' } },
                Meteor.bindEnvironment((err, epObjects: Array<IEndpointObject>) => getEndpointsCallback(err, epObjects)));
        }
    }

    function getEndpointsCallback(err, epObjects: Array<IEndpointObject>) {
        console.log('DeviceConnectorService - getEndpointsCallback()');
        if (err) throw err;

        console.log('Found', epObjects.length, 'endpoint' + (epObjects.length === 1 ? '' : 's'));

        let regs = Registrations.find({}).fetch();
        let toRemove = <string[]>_.pluck(regs, 'ep');
        let toAdd = <string[]>_.pluck(epObjects, 'name');
        toRemove = _.difference(toRemove, toAdd);
        Registrations.remove({ ep: { $in: toRemove } });

        epObjects.forEach((epObj) => {
            addRegistration(epObj.name, epObj.type);
        });
    }

    function addRegistration(epStr: string, epType: string) {
        console.log('DeviceConnectorService - addRegistration()');
        if (!Registrations.findOne({ ep: epStr })) {
            let reg = <IRegistration>{};
            reg.ep = epStr;
            reg.ept = epType;
            reg.resources = [];
            Registrations.insert(reg);
        }

        api.getResources(
            epStr,
            Meteor.bindEnvironment(
                (error, resources: Array<IEndpointResource>) => getResourcesCallback(error, epStr, resources)
            )
        );
    }

    function updateRegistration(registration: IRegistration) {
        console.log('DeviceConnectorService - updateRegistration()');
        let oldReg = Registrations.findOne({ ep: registration.ep });
        if (oldReg) {
            registration.resources.forEach(newRes => {
                let oldRes = oldReg.resources.find(res => _.isEqual(res.path, newRes.path));
                if (!oldRes) {
                    console.log(newRes);
                    Registrations.update(
                        oldReg._id,
                        { $push: { resources: { path: newRes.path, value: newRes.value } } }
                    );
                }
            });
        }
    }

    function getResourcesCallback(err, epStr: string, epResources: Array<IEndpointResource>) {
        console.log('DeviceConnectorService - getResourcesCallback()');
        if (epResources) {
            epResources.forEach(epRes => {
                api.getResourceValue(
                    epStr,
                    epRes.uri,
                    Meteor.bindEnvironment(
                        (error, value) => getResourceValueCallback(error, epStr, value, epRes)
                    )
                );
            });
        } else {
            console.warn("resources empty");
        }
    }

    function getResourceValueCallback(error, epStr: string, value, epRes: IEndpointResource) {
        console.log('DeviceConnectorService - getResourceValueCallback()');
        console.log(epRes.uri, value);
        let reg = Registrations.findOne({ ep: epStr });
        if (reg) {
            let oldRes = reg.resources.find(res => _.isEqual(res.path, epRes.uri));
            if (oldRes) {
                if (!_.isEqual(oldRes.value, value)) {
                    console.log('set', oldRes.path, '\"', oldRes.value, '\" with \"', value, '\"');
                    Registrations.update(
                        { ep: epStr, "resources.path": oldRes.path },
                        { $set: { "resources.$.value": value } }
                    );
                }
            } else {
                console.log('push', epRes.uri, value);
                Registrations.update(
                    { ep: epStr },
                    { $push: { resources: { path: epRes.uri, value: value } } }
                );
            }
        }
    }

    function onNotificationHandler(notification: INotification) {
        console.log('Got a notification ', notification);
        let reg = Registrations.findOne({ ep: notification.ep });
        if (reg) {
            let res = reg.resources.find(res => _.isEqual(res.path, notification.path));
            if (res) {
                let num = Registrations.update(
                    { ep: notification.ep, "resources.path": notification.path },
                    { $set: { "resources.$.value": notification.payload } }
                );
            }
        }
    }

    function onRegistrationHandler(registration: IRegistration) {
        console.log('Got a registration');
        addRegistration(registration.ep, registration.ept);
    }

    function onRegUpdateHandler(regUpdate: IRegistration) {
        console.log('Got a reg-update');
        updateRegistration(regUpdate);
    }

    function onDeRegistrationHandler(epStr: string) {
        console.log('Got a de-registration', epStr);
    }

    function onRegistrationExpiredHandler(epStr: string) {
        console.log('Got a registration-expired', epStr);
        let num = Registrations.remove({ ep: epStr });
        if (num > 0) {
            console.log("Removed registration: ", epStr);
        } else {
            console.log("Can not find registration: ", epStr);
        }
    }

    function getResources(epStr: string, callback: (error, epStr: string, resources: Array<IEndpointResource>) => void) {
        api.getResources(epStr, Meteor.bindEnvironment((error, resources: Array<IEndpointResource>) => callback(error, epStr, resources)));
    }

    function getResourceValue(epStr: string, path: string, callback: (error, value) => void) {
        api.getResourceValue(epStr, path, Meteor.bindEnvironment((error, value) => callback(error, value)));
    }

    export function putResourceValue(epStr: string, path: string, value) {
        api.putResourceValue(epStr, path, value);
    }

    export function putResourceSubscription(epStr: string, path: string) {
        console.log('subscribing to', epStr, path);
        api.putResourceSubscription(epStr, path);
    }

    export function deleteResourceSubscription(epStr: string, path: string) {
        console.log('unsubscribing from', epStr, path);
        api.deleteResourceSubscription(epStr, path);
    }
}