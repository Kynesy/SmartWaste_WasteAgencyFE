import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Alert } from 'src/app/models/alert';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit{
  alertList: Alert[] = [];
  
  constructor(private alertsService: AlertsService, private datePipe: DatePipe){}

  ngOnInit(): void {
      this.alertsService.getAllAlerts().subscribe(
        (alerts: Alert[]) => {
          this.alertList = alerts.reverse();
        },
        (error: any) => {
          console.error('Error retrieving alerts:', error);
        }
      )
  }

  formatTimestamp(timestamp: string, format: string): string {
    const date = new Date(timestamp);
    return this.datePipe.transform(date, format) || '';
  }
  
}
