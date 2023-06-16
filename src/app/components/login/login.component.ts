import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { GlobalEventsManager } from 'app/services/GlobalEventsManager.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    model: any = {};
    returnUrl: string;

    constructor(
        private popupProviderService: PopupProviderService,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private GlobalEventsManager: GlobalEventsManager) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        this.GlobalEventsManager.showNavBar(false);
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.authenticationService.login(this.model.username, this.model.password)
            .then(Usuario => {
                if (Usuario.Success && Usuario.PossibleError === '') {
                    localStorage.setItem('currentUser', JSON.stringify(Usuario));
                    this.GlobalEventsManager.showNavBar(true);
                    this.router.navigate([this.returnUrl]);
                } else {
                    if (Usuario.PossibleError === '') {
                        this.popupProviderService.SimpleMessage('Autenticacion', 'Usuario o clave incorrectos',
                            PopupType.WARNING);
                    } else {
                        this.popupProviderService.SimpleMessage('Autenticacion', Usuario.PossibleError,
                            PopupType.WARNING);
                    }
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

}
