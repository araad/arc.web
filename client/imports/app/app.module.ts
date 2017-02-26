import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { DeviceWidgetComponent } from './../device/device-widget/device-widget.component';
import { LightSwitchPanelComponent } from './../interfaces/light-switch/light-switch-widget/light-switch-widget.component';
import { LightSwitchModuleComponent } from './../modules/light-switch-module/light-switch-module.component';
import { ElectricalOutletPanelComponent } from './../interfaces/electrical-outlet/electrical-outlet-widget/electrical-outlet-widget.component';
import { ElectricalOutletModuleComponent } from './../modules/electrical-outlet-module/electrical-outlet-module.component';
import { TextboxEditorComponent } from './../core-ui/textbox-editor/textbox-editor.component';
import { BasicSwitchComponent } from './../core-ui/basic-switch/basic-switch.component';
import { MessageBoxDialogComponent } from './../core-ui/message-box/message-box-dialog/message-box-dialog.component';
import { MessageBoxComponent } from './../core-ui/message-box/message-box.component';
import { DeviceListComponent } from './../device/device-list/device-list.component';
import { DeviceDetailsComponent } from './../device/device-details/device-details.component';
import { AddDeviceDialogComponent } from './../device/add-device-dialog/add-device-dialog.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        MaterialModule.forRoot()
    ],
    declarations: [
        AppComponent,
        TextboxEditorComponent,
        BasicSwitchComponent,
        DeviceWidgetComponent,
        LightSwitchModuleComponent,
        LightSwitchPanelComponent,
        ElectricalOutletModuleComponent,
        ElectricalOutletPanelComponent,
        DeviceListComponent,
        DeviceDetailsComponent,
        AddDeviceDialogComponent,
        MessageBoxComponent,
        MessageBoxDialogComponent
    ],
    entryComponents: [AddDeviceDialogComponent, MessageBoxDialogComponent],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }