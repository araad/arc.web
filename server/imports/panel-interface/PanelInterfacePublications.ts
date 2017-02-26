import { Publication } from './../core/PublicationMetadata';
import { PanelInterfaces } from './../../../both/collections/panel-interface.collection';

export class PanelInterfacePublications {
    @Publication
    publishAllPanelInterfaces() {
        return PanelInterfaces.collection.find({});
    }
}