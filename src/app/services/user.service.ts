import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from './../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
const BACKEND_URL = `${environment.apiUrl}/user`;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }

  signUp(userData: User) {
    this.http
      .post<{ user: User; message: string }>(`${BACKEND_URL}/signup`, userData)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  login(userData: User) {
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${BACKEND_URL}/login`,
        userData
      )
      .subscribe(({ token, expiresIn, userId }) => {
        this.token = token;
        if (token) {
          this.setAuthTimer(expiresIn);
          this.userId = userId;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(token, expirationDate, userId);
          this.router.navigate(['/']);
        }
      });
  }

  getToken() {
    return this.token;
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

  autoAuthUser() {
    const authInfo = this.getAuthDate();
    if (!authInfo) return;
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    // check in future
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token: string, expiretionDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expiretionDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private getAuthDate() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) return;
    return {
      token,
      userId,
      expirationDate: new Date(expirationDate),
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }
}
