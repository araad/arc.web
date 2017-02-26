import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import template from './basic-switch.component.html';
import style from './basic-switch.component.scss';

@Component({
    selector: 'basic-switch',
    template: template,
    styles: [style]
})
export class BasicSwitchComponent implements OnInit {
    @Input() state: boolean;
    @Input() value: number;
    @Input() label: string;
    @Output() stateChange = new EventEmitter<Boolean>();
    @Output() labelChange = new EventEmitter<String>();

    ngOnInit() {

    }

    onStateChange(value: boolean) {
        this.stateChange.emit(value);
    }

    onLabelChange(value: string) {
        this.labelChange.emit(value);
    }
}