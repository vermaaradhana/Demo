import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private _auth: AuthService,
    private location: Location,
  ) {
    this.location = location
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserLogin();
  }

  checkUserLogin(): boolean {
    let token: any = localStorage.getItem('token');
    if (token) {
      if (this._auth.isAuthenticated()) {
        return true;
      }
      else {
        this.router.navigate(['login']);
        return false;
      }
    }
    else {
      this.router.navigate(['/login'])
      return false;
    }
  }

}
