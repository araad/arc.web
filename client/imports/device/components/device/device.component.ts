import { Component, Input } from '@angular/core';

import template from './device.component.html';
import style from './device.component.scss';
import { DeviceProxy } from './../../device.proxy';

@Component({
    selector: 'device',
    template: template,
    styles: [style]
})
export class DeviceComponent {
    @Input() device: DeviceProxy;

    onClick() {
        // this.device.saveName("Hello", (error, result) => {
        //     console.log(error);
        //     console.log(result);
        // });
    }
}