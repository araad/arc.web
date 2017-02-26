import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { MessageBoxResult } from './../message-box.component';

import template from './message-box-dialog.component.html';
import style from './message-box-dialog.component.scss';

@Component({
    selector: 'message-box-dialog',
    template: template,
    styles: [style]
})
export class MessageBoxDialogComponent implements OnInit {
    title: string;
    text: string;
    buttonsType;
    icon: string;
    iconClass: string;
    @Output() result = new EventEmitter<MessageBoxResult>();

    constructor(public dialogRef: MdDialogRef<MessageBoxDialogComponent>) { }

    ngOnInit() { }

    onCancelClick() {
        this.result.emit(MessageBoxResult.Cancel);
    }

    onAcceptClick() {
        this.result.emit(MessageBoxResult.Accept);
    }

    onRejectClick() {
        this.result.emit(MessageBoxResult.Reject);
    }
}