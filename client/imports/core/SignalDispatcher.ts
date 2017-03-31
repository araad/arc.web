import { EventEmitter } from '@angular/core';
import { Meteor } from 'meteor/meteor';

interface ISignal {
    event: EventEmitter<any>;
    handle: any;
}

export namespace SignalDispatcher {
    var signals = new Map<string, ISignal>();

    console.log('SignalDispatcher ready');

    export function subscribe(signalName: string, callback: Function, scope: any): any {

        // TODO: is it safe to support more than one subscriber to a signal?
        if (signals.get(signalName)) {
            throw new Error(`Cannot have more than one subscriber to signal ${signalName}`);
        }

        // Subscribe to the internal event that will be raised by the signal caller
        let event = new EventEmitter();
        let handle = event.subscribe(data => callback.call(scope, data));

        // Create an entry in the signals map of the new signal being exposed
        signals.set(signalName, { event: event, handle: handle });

        // return the handle to unsubscribe and unregister the signal
        return handle;
    }

    export function unsubscribe(signalName): void {
        let signal = signals.get(signalName);

        if (signal) {
            // unsubscribe from the internal event
            signal.handle.unsubscribe();

            // remove the signal entry in the signals map
            signals.delete(signalName);
        } else {
            console.log(`Warning: already unsubscribed from signal: ${signalName}`);
        }
    }

    export function dispatch(signalName: string, args?: any): void {
        let signal = signals.get(signalName);

        if (signal) {
            // Dispatch the signal async
            // TODO: set an option to disptach sync?
            Meteor.setTimeout(function () {
                signal.event.emit(args);
            }, 0);
        } else {
            console.log(`Warning: could not find any subscribers for signal: ${signalName}`);
        }
    }
}