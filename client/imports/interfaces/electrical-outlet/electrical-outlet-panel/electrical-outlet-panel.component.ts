import { Component, Input, OnInit, OnDestroy, AfterViewInit, SimpleChanges, SimpleChange, NgZone, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MdSnackBar, MdSlideToggle } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment/moment';

import { PanelInterfaces } from './../../../../../both/collections/panel-interface.collection';
import { IPanelInterface } from './../../../../../both/models/IPanelInterface';
import { ElectricalOutletProxy } from './../electrical-outlet.proxy';
import { ElectricalOutletModuleProxy } from './../../../modules/electrical-outlet-module/electrical-outlet-module.proxy';
import { MessageBoxSignals, MessageBoxType, IMessageBoxArgs, MessageBoxButtonsType, MessageBoxResult } from './../../../core-ui/message-box/message-box.component';
import { SignalDispatcher } from './../../../core/SignalDispatcher';

import template from './electrical-outlet-panel.component.html';
import style from './electrical-outlet-panel.component.scss';

let AmCharts = window['AmCharts'];
let LocalNotificationApi;

@Component({
    selector: 'electrical-outlet-panel',
    template: template,
    styles: [style]
})
export class ElectricalOutletPanelComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() panelInterfaceId: string;
    panelInterface: ElectricalOutletProxy;
    piComp: Tracker.Computation;
    columns = 2;
    @ViewChild('chart') chartElRef: ElementRef;
    chart: any;

    constructor(private zone: NgZone, public snackBar: MdSnackBar, private cdr: ChangeDetectorRef) {
        if (window.innerWidth <= 768) {
            this.columns = 1;
        } else {
            this.columns = 2;
        }
    }

    ngOnInit() {
        if (Meteor.isCordova) {
            if (window['cordova'] && window['cordova'].plugins) {
                LocalNotificationApi = window['cordova'].plugins.notification.local;

                LocalNotificationApi.on('click', (notification, state) => {
                    if (notification.id === 1) {
                        // TODO: turn off
                        // TODO: cancel timeout
                        let data = <ElectricalOutletModuleProxy>JSON.parse(notification.data);
                        console.log(data);
                        let outlet = <ElectricalOutletModuleProxy>this.panelInterface.outlets.find((o: ElectricalOutletModuleProxy) => {
                            console.log(o);
                            return o.instanceId === data.instanceId;
                        });
                        console.log(outlet);
                        outlet.cancelOutsideAreaNotificationTimeout();
                        outlet.setState(false);
                    }
                })
            }
        }

        this.piComp = Tracker.autorun(() => this.zone.run(() => {
            this.panelInterface = <ElectricalOutletProxy>PanelInterfaces.collection.findOne(this.panelInterfaceId, {
                transform: (doc) => new ElectricalOutletProxy(doc)
            });

            this.panelInterface.outlets.forEach(element => {
                if (element.sendOutsideAreaNotificationTimeout > 0) {
                    if (LocalNotificationApi) {
                        console.log('LocalNotificationApi scheduling notification');
                        var now = new Date().getTime(),
                            _1_sec_from_now = new Date(now + 1000);
                        LocalNotificationApi.schedule({
                            id: 1,
                            data: element,
                            at: _1_sec_from_now,
                            title: 'Forgot appliance on?',
                            text: "Click on this notification to turn it off. Note: the appliance will be turned off after 60 seconds if no action is taken",
                            led: "00FF01"
                        });
                    } else {
                        let msgArgs: IMessageBoxArgs = {
                            callback: (result) => {
                                element.cancelOutsideAreaNotificationTimeout();

                                if (result) {
                                    element.setState(false);
                                }
                            },
                            title: 'Forgot appliance on?',
                            text1: 'A sensitive appliance is still on while you\'re away, would you like to turn it off?',
                            text2: 'Note: the appliance will be turned off after 60 seconds if no action is taken.',
                            type: MessageBoxType.warn,
                            buttonsType: MessageBoxButtonsType.CancelAccept
                        };

                        SignalDispatcher.dispatch(MessageBoxSignals.show, msgArgs);
                    }
                }
            });
        }));
    }

    ngOnDestroy() {
        if (this.piComp) {
            this.piComp.stop();
        }
    }

    onAlwaysOnCheckedChange(outlet: ElectricalOutletModuleProxy, toggleCmp: MdSlideToggle) {
        outlet.setAlwaysOnTrigger(toggleCmp.checked);
    }

    onLocationCheckedChange(outlet: ElectricalOutletModuleProxy, toggleCmp: MdSlideToggle) {
        outlet.setLocationTrigger(toggleCmp.checked, (error, result) => {
            if (error) {
                Meteor.setTimeout(() => this.zone.run(() => toggleCmp.checked = false), 250);
                this.snackBar.open(error, null, {
                    duration: 5000
                });
            }
        });
    }

    ngAfterViewInit() {
        if (!Meteor.isCordova) {
            this.initChart();
            this.updateChart();
        }
    }

    initChart() {
        let plotEl = this.chartElRef.nativeElement;
        this.chart = AmCharts.makeChart(plotEl, {
            type: 'serial',
            creditsPosition: 'bottom-right',
            addClassNames: true,
            "categoryField": "label",
            "colors": [
                "#2b78e4", "#000000", "#f1c232"
            ],
            "fontSize": 14,
            "fontFamily": "Roboto",
            "theme": "default",
            "categoryAxis": {
                "gridPosition": "start"
            },
            "valueAxes": [
                {
                    "id": "ValueAxis-1",
                    "stackType": "regular"
                }
            ],
            "legend": {
                "enabled": false,
            }
        });

        let valueFields = [2, 3, 1];
        for (let i = 0; i < 3; i++) {
            let graph = new AmCharts.AmGraph();

            graph.balloonText = "[[value]]";
            graph.fillAlphas = 0.6;
            graph.type = "column";
            graph.valueField = valueFields[i];

            this.chart.addGraph(graph);
        }

        this.chart.validateData();
    }

    updateChart() {
        this.chart.dataProvider = [];
        let row = {};

        for (let i = 2; i >= 0; i--) {
            let month = moment().month() - i;
            row = { label: moment.months(month), 1: 0, 2: 0, 3: 0 };
            this.chart.dataProvider.push(row);
        }

        this.chart.validateData();
    }
}