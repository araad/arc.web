import { Publication } from './../core/PublicationMetadata';
import { Devices } from './../../../both/collections/devices.collection';

export class DevicePublications {
    @Publication
    publishAllDevices() {
        return Devices.collection.find({});
    }
}