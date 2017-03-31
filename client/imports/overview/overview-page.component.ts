import { Component } from '@angular/core';

import template from './overview-page.component.html';
import style from './overview-page.component.scss';

@Component({
    selector: 'overview-page',
    template: template,
    styles: [style]
})
export class OverviewPageComponent {
    ngOnDestroy() {
        console.log('OverviewPageComponent - ngOnDestroy()');
    }
}