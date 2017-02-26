import { Component, Input, OnInit, OnDestroy, SimpleChanges, SimpleChange, NgZone } from '@angular/core';

import template from './light-switch-widget.component.html';
import style from './light-switch-widget.component.scss';
import { PanelInterfaces } from './../../../../../both/collections/panel-interface.collection';
import { IPanelInterface } from './../../../../../both/models/IPanelInterface';
import { LightSwitchProxy } from './../light-switch.proxy';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'light-switch-panel',
    template: template,
    styles: [style]
})
export class LightSwitchPanelComponent implements OnInit, OnDestroy {
    @Input() panelInterfaceId: string;
    panelInterface: LightSwitchProxy;
    piComp: Tracker.Computation;

    constructor(private zone: NgZone) {

    }

    ngOnInit() {
        this.piComp = Tracker.autorun(() => this.zone.run(() => {
            this.panelInterface = <LightSwitchProxy>PanelInterfaces.collection.findOne(this.panelInterfaceId, {
                transform: (doc) => new LightSwitchProxy(doc)
            });
        }));
    }

    ngOnDestroy() {
        if (this.piComp) {
            this.piComp.stop();
        }
    }
}