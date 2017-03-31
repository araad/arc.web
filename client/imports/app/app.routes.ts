import { Route } from '@angular/router';

import { OverviewPageComponent } from './../overview/overview-page.component';
import { DeviceListComponent } from './../device/device-list/device-list.component';
import { DeviceDetailsComponent } from './../device/device-details/device-details.component';
import { ProximityMapComponent } from './../proximity/proximity-map/proximity-map.component';
import { LoginPageComponent } from './../login-page/login-page.component';
import { AuthGuard } from './../login-page/auth.guard';

let homepage;
if (Meteor.isCordova) {
    homepage = { path: '', redirectTo: 'device', pathMatch: 'full' };
} else {
    homepage = { path: '', component: OverviewPageComponent, canActivate: [AuthGuard] }
}

export const routes: Route[] = [
    homepage,
    { path: 'device', component: DeviceListComponent, canActivate: [AuthGuard] },
    { path: 'device/:deviceId', component: DeviceDetailsComponent, canActivate: [AuthGuard] },
    { path: 'map', component: ProximityMapComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginPageComponent }
];