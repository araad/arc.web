import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { AgmCoreModule } from 'angular2-google-maps/core';
import 'hammerjs';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { DeviceWidgetComponent } from './../device/device-widget/device-widget.component';
import { LightSwitchPanelComponent } from './../interfaces/light-switch/light-switch-widget/light-switch-widget.component';
import { LightSwitchModuleComponent } from './../modules/light-switch-module/light-switch-module.component';
import { ElectricalOutletPanelWidgetComponent } from './../interfaces/electrical-outlet/electrical-outlet-panel-widget/electrical-outlet-panel-widget.component';
import { ElectricalOutletPanelComponent } from './../interfaces/electrical-outlet/electrical-outlet-panel/electrical-outlet-panel.component';
import { ElectricalOutletModuleWidgetComponent } from './../modules/electrical-outlet-module/electrical-outlet-module-widget/electrical-outlet-module-widget.component';
import { TextboxEditorComponent } from './../core-ui/textbox-editor/textbox-editor.component';
import { BasicSwitchComponent } from './../core-ui/basic-switch/basic-switch.component';
import { MessageBoxDialogComponent } from './../core-ui/message-box/message-box-dialog/message-box-dialog.component';
import { MessageBoxComponent } from './../core-ui/message-box/message-box.component';
import { DeviceListComponent } from './../device/device-list/device-list.component';
import { DeviceDetailsComponent } from './../device/device-details/device-details.component';
import { AddDeviceDialogComponent } from './../device/add-device-dialog/add-device-dialog.component';
import { GeotagDeviceDialogComponent } from './../device/geotag-device-dialog/geotag-device-dialog.component';
import { ProximityTrackerComponent } from './../proximity/proximity-tracker/proximity-tracker.component';
import { ProximityMapComponent } from './../proximity/proximity-map/proximity-map.component';
import { OverviewPageComponent } from './../overview/overview-page.component';
import { TriggersComponent } from './../triggers/triggers.component';
import { LoginPageComponent } from './../login-page/login-page.component';
import { AuthGuard } from './../login-page/auth.guard';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        MaterialModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: Meteor.settings['public']['Maps_API_Key_Arc_Dev']
        })
    ],
    declarations: [
        AppComponent,
        TextboxEditorComponent,
        BasicSwitchComponent,
        DeviceWidgetComponent,
        LightSwitchModuleComponent,
        LightSwitchPanelComponent,
        ElectricalOutletModuleWidgetComponent,
        ElectricalOutletPanelWidgetComponent,
        ElectricalOutletPanelComponent,
        DeviceListComponent,
        DeviceDetailsComponent,
        AddDeviceDialogComponent,
        MessageBoxComponent,
        MessageBoxDialogComponent,
        GeotagDeviceDialogComponent,
        ProximityTrackerComponent,
        ProximityMapComponent,
        OverviewPageComponent,
        TriggersComponent,
        LoginPageComponent
    ],
    providers: [
        AuthGuard
    ],
    entryComponents: [AddDeviceDialogComponent, GeotagDeviceDialogComponent, MessageBoxDialogComponent],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }