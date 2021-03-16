import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    public jwtHelper: JwtHelperService,
  ) { }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('token');
    return this.router.navigate(['login']);
  }

  isAuthenticated(): boolean {
    const token:any= localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
  
  getUser() {
    const token:any = localStorage.getItem('token');
    return this.jwtHelper.decodeToken(token);
  }
}
