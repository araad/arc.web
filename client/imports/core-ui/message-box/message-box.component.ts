import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { SignalDispatcher } from './../../core/SignalDispatcher';
import { MessageBoxDialogComponent } from './message-box-dialog/message-box-dialog.component';

import template from './message-box.component.html';
import style from './message-box.component.scss';

export var MessageBoxSignals = {
    show: 'arc.core.ui.MessageBox.show'
}

export enum MessageBoxType {
    warn,
    error,
    success,
    info
}

export enum MessageBoxButtonsType {
    Accept,
    CancelAccept,
    CancelAcceptReject
}

var icons = {
    success: 'check_circle',
    warn: 'error',
    error: 'cancel',
    info: 'help'
};

export interface IMessageBoxArgs {
    title: string
    text: string
    buttonsType: MessageBoxButtonsType
    type?: MessageBoxType
    callback?: Function
}

export enum MessageBoxResult {
    Cancel,
    Accept,
    Reject
}

@Component({
    selector: 'message-box',
    template: template,
    styles: [style]
})
export class MessageBoxComponent implements OnInit, OnDestroy {
    icon: string;
    iconClass: string;
    callback: Function;
    dialogRef: MdDialogRef<MessageBoxDialogComponent>;

    constructor(private dialog: MdDialog, private zone: NgZone) {
        // Register Signals
        SignalDispatcher.subscribe(MessageBoxSignals.show, (args) => {
            this.zone.run(() => this.onShow(args));
        }, this);
    }

    ngOnInit() { }

    ngOnDestroy() {
        SignalDispatcher.unsubscribe(MessageBoxSignals.show);
        this.dialogRef.componentInstance.result.unsubscribe();
    }

    onShow(args) {
        if (args && args.data) {
            let msgArgs: IMessageBoxArgs = args.data;

            this.callback = msgArgs.callback;

            let config = new MdDialogConfig();
            config.disableClose = true;

            this.dialogRef = this.dialog.open(MessageBoxDialogComponent, config);

            this.dialogRef.componentInstance.title = msgArgs.title;
            this.dialogRef.componentInstance.text = msgArgs.text;
            this.dialogRef.componentInstance.buttonsType = msgArgs.buttonsType;
            this.dialogRef.componentInstance.result.subscribe(val => this.onResult(val));
        } else {
            console.log("MessageBox - show: WARNING missing arguments");
        }
    }

    onResult(result: MessageBoxResult) {
        this.callback(result);
        this.dialogRef.close();
    }

    onDialogClosed(e) {
        this.dialogRef.componentInstance.title = null;
        this.dialogRef.componentInstance.text = null;
        this.callback = null;
    }
}