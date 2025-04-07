import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface usersDetail {
  firstName: string,
  email: string,
  phoneNo: string,
  password:string,
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // post_apiUrl = "https://task-backend-chi-ten.vercel.app/users";
  post_apiUrl = "http://localhost:3000/users";
  login_apiUrl = "http://localhost:3000/auth/login";
  constructor(private http: HttpClient) { }

  postData(data:any): Observable<usersDetail> {
    console.log("postdata",data);
    return this.http.post<usersDetail>(this.post_apiUrl,data)
  }

  loginData(data:any) {
    return this.http.post(this.login_apiUrl,data)
  }
}
