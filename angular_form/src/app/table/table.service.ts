import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import {production } from '../../enviroments/production';
import { environment } from '../../enviroments/environment';
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
  apiUrl = environment.apiUrl+'users';
  constructor(private http: HttpClient) { }
  getAllData(headers:any):Observable<userData[]>{
   return this.http.get<userData[]>(this.apiUrl,{headers})
  }

  deleteUser(id:any,headers:any):Observable<userData[]>{
    return this.http.delete<userData[]>(this.apiUrl+'/'+id,{headers})
   }

   viewUser(id:any,headers:any){
     const data = this.http.get(this.apiUrl+'/'+id,{headers})
     return data;
   }

   editUser(id:any,body:any,headers:any):Observable<userData[]>{
    return this.http.patch<userData[]>(this.apiUrl+'/'+id,body,{headers})
   }
}
