import { Route } from '@angular/router';

import { DeviceListComponent } from './../device/device-list/device-list.component';
import { DeviceDetailsComponent } from './../device/device-details/device-details.component';

export const routes: Route[] = [
    { path: '', component: DeviceListComponent },
    { path: 'device/:deviceId', component: DeviceDetailsComponent }
];