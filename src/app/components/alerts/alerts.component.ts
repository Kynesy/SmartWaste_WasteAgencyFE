import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Alert } from 'src/app/models/alert';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  /**
   * Lista degli avvisi visualizzati nell'app.
   * @type {Alert[]}
   */
  alertList: Alert[] = [];
  
  /**
   * Costruttore del componente.
   * @param {AlertsService} alertsService - Servizio per gestire gli avvisi.
   * @param {DatePipe} datePipe - Servizio per formattare le date.
   */
  constructor(private alertsService: AlertsService, private datePipe: DatePipe) {}

  /**
   * Metodo chiamato quando il componente è inizializzato.
   */
  ngOnInit(): void {
    /**
     * Recupera tutti gli avvisi dal servizio di avvisi.
     * @param {Alert[]} alerts - Lista degli avvisi recuperati.
     */
    this.alertsService.getAllAlerts().subscribe(
      (alerts: Alert[]) => {
        // Inverti l'ordine degli avvisi e assegnalo alla lista di avvisi
        this.alertList = alerts.reverse();
      },
      /**
       * Gestione degli errori in caso di errore durante il recupero degli avvisi.
       * @param {any} error - L'errore ricevuto.
       */
      (error: any) => {
        console.error('Error retrieving alerts:', error);
      }
    );
  }

  /**
   * Formatta un timestamp in base al formato specificato.
   * @param {string} timestamp - Il timestamp da formattare.
   * @param {string} format - Il formato desiderato per la data.
   * @returns {string} La data formattata.
   */
  formatTimestamp(timestamp: string, format: string): string {
    const date = new Date(timestamp);
    // Utilizza il servizio DatePipe per formattare il timestamp in base al formato specificato
    return this.datePipe.transform(date, format) || '';
  }
}
