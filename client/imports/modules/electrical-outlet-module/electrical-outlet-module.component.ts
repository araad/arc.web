import { Component, OnInit, Input } from '@angular/core';

import template from './electrical-outlet-module.component.html';
import style from './electrical-outlet-module.component.scss';

import { ElectricalOutletModuleProxy } from './electrical-outlet-module.proxy';

@Component({
    selector: 'electrical-outlet-module',
    template: template,
    styles: [style],
})
export class ElectricalOutletModuleComponent implements OnInit {
    @Input() proxy: ElectricalOutletModuleProxy;

    ngOnInit() {

    }

    onChange(checked: boolean) {
        this.proxy.setState(checked);
    }

    onNameChange(value: string) {
        this.proxy.setName(value);
    }
}