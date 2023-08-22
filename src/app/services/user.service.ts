import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authToken: string | null = null
  baseUrl: string = "http://localhost:8081/api/user/";

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

  existUser(userEmail: string): Observable<boolean>{
    const existUrl = this.baseUrl + 'exist/' + userEmail;

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
    const createUrl = this.baseUrl + 'create';

    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.post(createUrl, user, this.httpOptions);
  }

  updateUser(user: User): Observable<any> {
    const updateUrl = this.baseUrl + 'update';

    if (this.authToken) {
      console.log(this.authToken);
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }

    return this.httpClient.post(updateUrl, user, this.httpOptions);
  }

  deleteUser(userID: string): Observable<any>{
    const deleteUrl = this.baseUrl + 'delete/' + userID;

    if (this.authToken) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + this.authToken);
    }
    
    return this.httpClient.delete(deleteUrl, this.httpOptions);  
  }

  getUser(userID: string): Observable<User>{
    const getUserUrl = this.baseUrl + 'get/' + userID;

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
