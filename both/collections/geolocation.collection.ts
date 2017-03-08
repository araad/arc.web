import { Mongo } from 'meteor/mongo';

export const Geolocation = new Mongo.Collection('geolocation');

Geolocation.allow({
    insert: () => true,
    remove: () => true,
    fetch: ['lat', 'lng']
});