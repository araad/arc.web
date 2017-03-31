import { PowerConsumptionRecord } from './../models/PowerConsumptionRecord';

export const PowerConsumptionCollection = new Mongo.Collection<PowerConsumptionRecord>('powerConsumption');