import { ITrigger } from './../models/ITrigger';

export const Triggers = new Mongo.Collection<ITrigger>('triggers');