declare module 'meteor/meteor' {
    export module Meteor {
        function bindEnvironment(fn: Function, err?: Function);
    }
}