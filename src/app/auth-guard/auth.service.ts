import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    public jwtHelper: JwtHelperService,
    private http: HttpClient
  ) { }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('token');
    return this.router.navigate(['login']);
  }

  isAuthenticated(): boolean {
    // const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    // return !this.jwtHelper.isTokenExpired(token);
    return true;
  }
  
  getUser() {
    const token = localStorage.getItem('token');
    // return this.jwtHelper.decodeToken(token);
    // return JSON.parse(localStorage.getItem('profile'))
    return true;
  }
}
