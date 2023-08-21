import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }


  calculateDistanceMatrix(locations: number[][]) {
    const apiUrl = 'https://api.openrouteservice.org/v2/matrix/driving-car';
    const apiKey = '5b3ce3597851110001cf62486897bff3d70c4ca689cf49665909672b'; // Replace with your OpenRouteService API key
  
    const body = {
      locations: locations
    };
  
    const headers = {
      'Authorization': `Bearer ${apiKey}`
    };
  
    return this.http.post(apiUrl, body, { headers });
  }
  
}