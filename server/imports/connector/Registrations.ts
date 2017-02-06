import { Mongo } from 'meteor/mongo';
import { IRegistration } from './IRegistration';

export const Registrations = new Mongo.Collection<IRegistration>('registrations');