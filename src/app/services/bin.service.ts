import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Bin } from '../models/bin';
import { Observable, catchError } from 'rxjs';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BinService {
  authToken: string | null = null
  baseUrl: string = "http://localhost:8081/api/bin/";

  constructor(private storageService: SessionStorageService, private httpClient: HttpClient) {
  }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization':''
    })
  }

  createBin(bin: Bin): Observable<any>{
    const createBinURL = this.baseUrl + 'create';

    this.authToken = this.storageService.getData("token");
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.post(createBinURL, bin, this.httpOptions);
  }

  deleteBin(binID: string): Observable<any>{
    const deleteBinURL = this.baseUrl + 'delete/' + binID;

    this.authToken = this.storageService.getData("token");
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.delete(deleteBinURL, this.httpOptions);  
  }

  getBin(binID: string): Observable<Bin>{
    const getBinURL = this.baseUrl + 'get/' + binID;

    this.authToken = this.storageService.getData("token");
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.get<Bin>(getBinURL, this.httpOptions).pipe(
      catchError((error: any) => {
        console.error('Error retrieving bin:', error);
        throw error;
      })
    );  
  }

  getAllBins(): Observable<Bin[]> {
    const getAllBinsURL = this.baseUrl + 'get/all';
  
    this.authToken = this.storageService.getData("token");
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
  
    return this.httpClient.get<Bin[]>(getAllBinsURL, this.httpOptions).pipe(
      catchError((error: any) => {
        console.error('Error retrieving bins:', error);
        throw error;
      })
    );
  }
}
