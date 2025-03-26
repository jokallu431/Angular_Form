import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface userData{
    id:string,
    name: string,
    email: string,
    phoneNo: string,
}

@Injectable({
  providedIn: 'root'
})

export class TableService {
  apiUrl ="http://localhost:3000/users"
  
  constructor(private http: HttpClient) { }

  getAllData():Observable<userData[]>{
   return this.http.get<userData[]>(this.apiUrl)
  }
}
