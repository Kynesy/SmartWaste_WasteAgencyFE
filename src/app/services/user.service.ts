import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from '../models/user';
import { SessionStorageService } from './session-storage.service';

import {default as BackendURL} from 'BackendURL.json';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authToken: string | null = null
  baseUrl: string = BackendURL.WasteDIsposalAgencyBE + "/user";

  constructor(private storageService: SessionStorageService, private httpClient: HttpClient) {
  }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization':''
    })
  }

  existUser(userId: string): Observable<boolean>{
    const existUrl = this.baseUrl + '/exist/' + userId;

    this.authToken = this.storageService.getData("token");
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.get(existUrl, this.httpOptions).pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      })
    );
  }

  createUser(user: User): Observable<any> {
    const createUrl = this.baseUrl + '/create';

    this.authToken = this.storageService.getData("token");
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.post(createUrl, user, this.httpOptions);
  }

  updateUser(user: User): Observable<any> {
    const updateUrl = this.baseUrl + '/update';

    this.authToken = this.storageService.getData("token");
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }

    return this.httpClient.post(updateUrl, user, this.httpOptions);
  }

  deleteUser(userID: string): Observable<any>{
    const deleteUrl = this.baseUrl + '/delete/' + userID;

    this.authToken = this.storageService.getData("token");
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.delete(deleteUrl, this.httpOptions);  
  }

  getUser(userID: string): Observable<User>{
    const getUserUrl = this.baseUrl + '/get/' + userID;

    this.authToken = this.storageService.getData("token");
    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.get<User>(getUserUrl, this.httpOptions).pipe(
      catchError((error: any) => {
        console.error('Error retrieving user:', error);
        throw error;
      })
    );  
  }

}
