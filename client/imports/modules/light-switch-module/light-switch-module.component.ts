import { Component, OnInit, Input } from '@angular/core';

import template from './light-switch-module.component.html';
import style from './light-switch-module.component.scss';

import { LightSwitchModuleProxy } from './light-switch-module.proxy';

@Component({
    selector: 'light-switch-module',
    template: template,
    styles: [style],
})
export class LightSwitchModuleComponent implements OnInit {
    @Input() proxy: LightSwitchModuleProxy;

    ngOnInit() {

    }

    onChange(checked: boolean) {
        this.proxy.setSwitch(checked);
    }

    onNameChange(value: string) {
        this.proxy.setName(value);
    }
}