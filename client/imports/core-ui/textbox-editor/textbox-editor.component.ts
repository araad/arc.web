import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import template from './textbox-editor.component.html';
import style from './textbox-editor.component.scss';

@Component({
    selector: 'textbox-editor',
    template: template,
    styles: [style]
})
export class TextboxEditorComponent implements OnInit {
    @Input() value: string;
    editing: boolean;
    @Output() valueChange = new EventEmitter<string>();
    @Input() size = "normal";

    ngOnInit() {

    }

    onEdit(textbox) {
        this.editing = true;
        Meteor.setTimeout(() => textbox.focus(), 0);
    }

    onClose() {
        this.editing = false;
    }

    onSave(value: string) {
        if (!_.isEqual(value, this.value)) {
            this.valueChange.emit(value);
        }
        this.editing = false;
    }

    getDisplayClass() {
        let classStr = this.size;

        if (this.editing) {
            classStr += " hidden";
        }

        return classStr;
    }

    getEditClass() {
        let classStr = this.size;

        if (!this.editing) {
            classStr += " hidden";
        }

        return classStr;
    }
}