import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Bin } from '../models/bin';

@Injectable({
  providedIn: 'root'
})
export class BinService {
  authToken: string | null = null
  baseUrl: string = "http://localhost:8080/api/user/";
  
  bins: Bin[] = [
    {
      id: '1',
      lat: 40.3539,
      long: 18.1756,
      capacity: 100,
      sortedWaste: 10,
      unsortedWaste: 30,
      alertLevel: 0
    },
    {
      id: '2',
      lat: 40.3600,
      long: 18.1800,
      capacity: 100,
      sortedWaste: 30,
      unsortedWaste: 30,
      alertLevel: 1
    },
    {
      id: '3',
      lat: 40.3500,
      long: 18.1700,
      capacity: 100,
      sortedWaste: 70,
      unsortedWaste: 20,
      alertLevel: 2
    },
    {
      id: '4',
      lat: 40.3550,
      long: 18.1720,
      capacity: 100,
      sortedWaste: 50,
      unsortedWaste: 40,
      alertLevel: 1
    },
    {
      id: '5',
      lat: 40.3580,
      long: 18.1770,
      capacity: 100,
      sortedWaste: 80,
      unsortedWaste: 10,
      alertLevel: 0
    },
    {
      id: '6',
      lat: 40.3520,
      long: 18.1850,
      capacity: 100,
      sortedWaste: 20,
      unsortedWaste: 80,
      alertLevel: 2
    },
    {
      id: '7',
      lat: 40.3450,
      long: 18.1600,
      capacity: 100,
      sortedWaste: 60,
      unsortedWaste: 30,
      alertLevel: 2
    },
    {
      id: '8',
      lat: 40.3480,
      long: 18.1760,
      capacity: 100,
      sortedWaste: 10,
      unsortedWaste: 90,
      alertLevel: 2
    },
    {
      id: '9',
      lat: 40.3590,
      long: 18.1630,
      capacity: 100,
      sortedWaste: 70,
      unsortedWaste: 20,
      alertLevel: 2
    },
    {
      id: '10',
      lat: 40.3610,
      long: 18.1720,
      capacity: 100,
      sortedWaste: 40,
      unsortedWaste: 30,
      alertLevel: 1
    },
    {
      id: '11',
      lat: 40.3570,
      long: 18.1750,
      capacity: 100,
      sortedWaste: 10,
      unsortedWaste: 60,
      alertLevel: 1
    },
    {
      id: '12',
      lat: 40.3505,
      long: 18.1780,
      capacity: 100,
      sortedWaste: 80,
      unsortedWaste: 10,
      alertLevel: 0
    },
    {
      id: '13',
      lat: 40.3557,
      long: 18.1680,
      capacity: 100,
      sortedWaste: 20,
      unsortedWaste: 70,
      alertLevel: 1
    },
    {
      id: '14',
      lat: 40.3602,
      long: 18.1820,
      capacity: 100,
      sortedWaste: 60,
      unsortedWaste: 40,
      alertLevel: 2
    },
    {
      id: '15',
      lat: 40.3543,
      long: 18.1750,
      capacity: 100,
      sortedWaste: 30,
      unsortedWaste: 30,
      alertLevel: 1
    },
  ];
   

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

  createBin(){

  }

  deleteBin(){

  }

  getBin(){

  }

  getAllBins(){
    return this.bins;
  }

  unloadBin(){

  }

  loadBin(){

  }


}
