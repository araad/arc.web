import { Publication } from './../core/PublicationMetadata';
import { Triggers } from './../../../both/collections/trigger.collection';

export class TriggerPublications {
    @Publication
    publishAllTriggers() {
        return Triggers.find({});
    }
}