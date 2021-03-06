import { Component, Input, OnInit, OnDestroy, SimpleChanges, SimpleChange, NgZone } from '@angular/core';

import { PanelInterfaces } from './../../../../../both/collections/panel-interface.collection';
import { IPanelInterface } from './../../../../../both/models/IPanelInterface';
import { ElectricalOutletProxy } from './../electrical-outlet.proxy';
import { Observable } from 'rxjs/Observable';

import template from './electrical-outlet-panel-widget.component.html';
import style from './electrical-outlet-panel-widget.component.scss';

@Component({
    selector: 'electrical-outlet-panel-widget',
    template: template,
    styles: [style]
})
export class ElectricalOutletPanelWidgetComponent implements OnInit, OnDestroy {
    @Input() panelInterfaceId: string;
    panelInterface: ElectricalOutletProxy;
    piComp: Tracker.Computation;

    constructor(private zone: NgZone) {

    }

    ngOnInit() {
        this.piComp = Tracker.autorun(() => this.zone.run(() => {
            this.panelInterface = <ElectricalOutletProxy>PanelInterfaces.collection.findOne(this.panelInterfaceId, {
                transform: (doc) => new ElectricalOutletProxy(doc)
            });
        }));
    }

    ngOnDestroy() {
        if (this.piComp) {
            this.piComp.stop();
        }
    }
}