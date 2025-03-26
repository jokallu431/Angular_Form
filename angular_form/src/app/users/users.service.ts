import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface usersDetail {
  firstName: string,
  email: string,
  phoneNo: string,
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  post_apiUrl = "http://localhost:3000/users";
  constructor(private http: HttpClient) { }

  postData(data:any): Observable<usersDetail> {
    return this.http.post<usersDetail>(this.post_apiUrl,data)
  }
}
