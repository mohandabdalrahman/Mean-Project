import { Subject } from 'rxjs';
import { User } from './../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signUp(userData: User) {
    this.http
      .post<{ user: User; message: string }>(
        'http://localhost:5000/api/user/signup',
        userData
      )
      .subscribe((resData) => {
        console.log(resData);
      });
  }

  login(userData: User) {
    this.http
      .post<{ token: string }>('http://localhost:5000/api/user/login', userData)
      .subscribe((resData) => {
        this.token = resData.token;
        this.authStatusListener.next(true);
      });
  }

  getToken() {
    return this.token;
  }
}
