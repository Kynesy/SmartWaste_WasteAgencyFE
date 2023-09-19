import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styles: []
})
export class LogoutButtonComponent {
  /**
   * Costruttore del componente.
   * @param {AuthService} auth - Il servizio di autenticazione fornito da Auth0.
   * @param {Document} doc - Il servizio di gestione del documento HTML.
   * @param {SessionStorageService} storageService - Il servizio di gestione del token locale.
   */
  constructor(public auth: AuthService, @Inject(DOCUMENT) private doc: Document, private storageService: SessionStorageService) {}

  /**
   * Esegue il processo di logout dell'utente.
   * Utilizza il servizio di autenticazione per effettuare il logout e specifica il percorso di reindirizzamento
   * all'origine dell'applicazione dopo il logout.
   */
  logout(): void {
    this.storageService.clearData();
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin}});
  }
}
