import { Injectable } from '@angular/core';
import { LogInResponse } from '../models/log-in-response';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  public isUserLogged(){
    if(sessionStorage.getItem("logged")){
      return true;
    }
    return false;
  }

  public logInUser(logInResponse: LogInResponse){
    sessionStorage.setItem("username", logInResponse.username);
    sessionStorage.setItem("email", logInResponse.email);
    sessionStorage.setItem("id", logInResponse.id);
    sessionStorage.setItem("token", logInResponse.token);

    const roleParts = logInResponse.role.split('_'); // Split the role string
    if (roleParts.length === 2) {
      const extractedRole = roleParts[1]; // Get the part after the underscore
      sessionStorage.setItem("role", extractedRole); // Store it in sessionStorage
    }

    sessionStorage.setItem("logged", "true");
  }

  public logOutUser(){
    sessionStorage.clear();
  }

  public saveData(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  public getData(key: string) {
    return sessionStorage.getItem(key)
  }
  public removeData(key: string) {
    sessionStorage.removeItem(key);
  }

  public clearData() {
    sessionStorage.clear();
  }
}
