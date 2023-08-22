import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Bin } from '../models/bin';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinService {
  authToken: string | null = null
  baseUrl: string = "http://localhost:8081/api/bin/";

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

  createBin(bin: Bin): Observable<any>{
    const createBinURL = this.baseUrl + 'create';

    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.post(createBinURL, bin, this.httpOptions);
  }

  deleteBin(binID: string): Observable<any>{
    const deleteBinURL = this.baseUrl + 'delete/' + binID;

    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.delete(deleteBinURL, this.httpOptions);  
  }

  getBin(binID: string): Observable<Bin>{
    const getBinURL = this.baseUrl + 'get/' + binID;

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
    const getAllBinsURL = this.baseUrl + 'getAll';
  
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
  

  unloadBin(binID: string): Observable<any> {
    const unloadBinURL = this.baseUrl + 'unload/' + binID;
  
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
  
    return this.httpClient.post(unloadBinURL, null, this.httpOptions).pipe(
      catchError((error: any) => {
        console.error('Error unloading bin:', error);
        throw error;
      })
    );
  }
  
  loadBin(binID: string, sortedWaste: number, unsortedWaste: number): Observable<any> {
    const loadBinURL = this.baseUrl + 'setWaste/' + binID + '/' + sortedWaste + '/' + unsortedWaste;
  
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
  
    return this.httpClient.post(loadBinURL, null, this.httpOptions).pipe(
      catchError((error: any) => {
        console.error('Error loading bin:', error);
        throw error;
      })
    );
  }
  
}
