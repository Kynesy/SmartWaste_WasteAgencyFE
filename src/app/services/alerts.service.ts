import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, catchError } from 'rxjs';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  authToken: string | null = null
  baseUrl: string = "http://localhost:8081/api/alert/";

  constructor(private authService: AuthService, private httpClient: HttpClient) {
    this.authService.idTokenClaims$.subscribe(
      (token) => {
        if(token && token['__raw']){
          this.authToken = token['__raw']
        }
      }
    )
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization':''
    })
  }

  getAllAlerts(): Observable<Alert[]> {
    const getAllAlertsURL = this.baseUrl + 'get/all';
  
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
