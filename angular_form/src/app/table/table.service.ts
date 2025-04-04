import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { environment } from '../../enviroments/environment';
import {production } from '../../enviroments/production';
export interface userData{userdata:[
    name: string,
    email: string,
    phoneNo: string,
]
}

@Injectable({
  providedIn: 'root'
})

export class TableService {
  apiUrl = production.apiUrl+'users'
  constructor(private http: HttpClient) { }

  getAllData():Observable<userData[]>{
   return this.http.get<userData[]>(this.apiUrl)
  }

  deleteUser(id:any):Observable<userData[]>{
    return this.http.delete<userData[]>(this.apiUrl+'/'+id)
   }

   viewUser(id:any):Observable<userData[]>{
     const data = this.http.get<userData[]>(this.apiUrl+'/'+id)
     return data;
   }

   editUser(id:any,body:any):Observable<userData[]>{
    return this.http.patch<userData[]>(this.apiUrl+'/'+id,body)
   }
}
