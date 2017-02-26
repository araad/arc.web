import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceProxy } from './../device.proxy';

import template from './device-widget.component.html';
import style from './device-widget.component.scss';

@Component({
    selector: 'device-widget',
    template: template,
    styles: [style]
})
export class DeviceWidgetComponent {
    @Input() device: DeviceProxy;

    constructor(private router: Router) {

    }

    onMoreClick() {
        console.log('routing');
        this.router.navigate(['/device', this.device._id]);
    }

    onNameChange(value) {
        console.log("DeviceWidgetComponent - onNameChange() value: ", value);
        this.device.saveName(value);
    }
}