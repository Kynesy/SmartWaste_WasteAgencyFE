import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styles: []
})
export class LoginButtonComponent {
  /**
   * Costruttore del componente.
   * @param {AuthService} auth - Il servizio di autenticazione fornito da Auth0.
   */
  constructor(public auth: AuthService) {}

  /**
   * Avvia il processo di login reindirizzando l'utente alla pagina di autenticazione.
   */
  loginWithRedirect(): void {
    this.auth.loginWithRedirect({
      appState: { target: '/callback' }
    });
  }
}
