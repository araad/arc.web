import { Component } from '@angular/core';

import { Triggers } from './../../../both/collections/trigger.collection';

@Component({
    selector: 'triggers',
    template: '<template></template>',
    styles: [':host {display:none;}']
})
export class TriggersComponent {
    triggerSubHandle: Meteor.SubscriptionHandle;
    triggerQueryHandle: Meteor.LiveQueryHandle;

    ngOnInit() {
        this.triggerSubHandle = Meteor.subscribe('triggers');
    }

    ngOnDestroy() {
        if (this.triggerSubHandle) {
            this.triggerSubHandle.stop();
        }

        if (this.triggerQueryHandle) {
            this.triggerQueryHandle.stop();
        }

        console.log('TriggersComponent - ngOnDestroy()');
    }
}