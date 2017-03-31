import { TriggerPublications } from './TriggerPublications';
import { TriggerObserver } from './TriggerObserver';

export namespace TriggerManager {
    export function Start() {
        new TriggerPublications();
        new TriggerObserver();
    }
}