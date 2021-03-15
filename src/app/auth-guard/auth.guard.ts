import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
  // checkUserLogin(next: ActivatedRouteSnapshot, url: any): boolean {
  //   let user=JSON.parse(localStorage.getItem('profile'));
  //   let token=localStorage.getItem('token')
  //   if (this._authService.isAuthenticated()) {
  //     // if(token){
  //     if(next.data.role.includes(user.role)){
  //       return true;   
  //     }
  //     this.router.navigate(['login']);
  //     return false;   
  //   }
  //   else{
  //     this.router.navigate(['login']);
  //     return false;
  //   }
  // }

}
