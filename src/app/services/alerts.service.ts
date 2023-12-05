import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Alert } from '../models/alert';
import { SessionStorageService } from './session-storage.service';

import {default as BackendURL} from 'BackendURL.json';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  authToken: string | null = null
  baseUrl: string = BackendURL.WasteDIsposalAgencyBE + "/api/alert/";

  constructor(private storageService: SessionStorageService, private httpClient: HttpClient) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization':''
    })
  }

  getAllAlerts(): Observable<Alert[]> {
    const getAllAlertsURL = this.baseUrl + 'get/all';
  
    this.authToken = this.storageService.getData("token");
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
  
    return this.httpClient.get<Alert[]>(getAllAlertsURL, this.httpOptions).pipe(
      catchError((error: any) => {
        console.error('Error retrieving bins:', error);
        throw error;
      })
    );
  }

}
