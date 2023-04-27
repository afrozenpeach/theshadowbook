import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    public authService: AuthService,
    public router: Router
  ){ }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isLoggedIn !== true) {
      this.router.navigate(['sign-in'])
      return false;
    }

    return this.authService.afAuth.authState.pipe(map((user) => {
      if (user) {
        return true;
      } else {
        return false;
      }
    }));
  }
}