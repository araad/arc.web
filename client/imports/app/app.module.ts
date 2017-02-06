import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { AppComponent } from './app.component';
import { DeviceComponent } from './../device/components/device/device.component';

@NgModule({
    imports: [
        BrowserModule,
        MaterialModule.forRoot()
    ],
    declarations: [
        AppComponent,
        DeviceComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }