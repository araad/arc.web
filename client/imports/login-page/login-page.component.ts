import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import template from './login-page.component.html';
import style from './login-page.component.scss';

@Component({
    selector: 'login-page',
    template: template,
    styles: [style]
})
export class LoginPageComponent {
    error;
    returnUrl: string;

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onLoginClick(username: string, password: string) {
        this.error = null;
        Meteor.loginWithPassword(username, password, (error) => {
            console.log('login callback');
            if (error) {
                console.log(error);
                this.error = error;
            } else {
                Meteor.logoutOtherClients(error => console.log('logoutotherClients', error));
                this.router.navigate([this.returnUrl]);
            }
        });
    }
}