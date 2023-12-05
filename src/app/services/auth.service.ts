import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';
import { Observable, catchError } from 'rxjs';
import { SignUpResponse } from '../models/sign-up-response';
import { LogInResponse } from '../models/log-in-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authURL: string = "http://localhost:8083/api/auth";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json'
    })
  }

  constructor(private httpClient: HttpClient, private storageService: SessionStorageService) { }

  signUp(username: string, email: string, password: string, role: string): Observable<SignUpResponse>{
    const signUpUrl = this.authURL + '/signup';
    const body = {
      "email": email,
      "password": password,
      "username": username,
      "role": role,
    }
    return this.httpClient.post<SignUpResponse>(signUpUrl, body, this.httpOptions)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          throw error; // Rethrow it back to the component
        })
      );
  }

  logIn(username: string, password: string): Observable<LogInResponse>{
    const logInUrl = this.authURL + '/signin';
    const body = {
      "username": username,
      "password": password
    }
    return this.httpClient.post<LogInResponse>(logInUrl, body, this.httpOptions)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          throw error; // Rethrow it back to the component
        })
      );
  }

  deleteUser(token: string): Observable<String>{
    const deleteUrl = this.authURL + '/delete/' + token;
    
    return this.httpClient.delete<String>(deleteUrl, this.httpOptions)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          throw error; // Rethrow it back to the component
        })
      );
  }
}
