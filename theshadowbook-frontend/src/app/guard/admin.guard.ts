import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { Observable, combineLatest, of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { BackendService } from '../services/backend.service';
@Injectable({
  providedIn: 'root'
})
export class AdminGuard {

  constructor(
    public authService: AuthService,
    public router: Router,
    private backendService: BackendService
  ){ }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.authService.isLoggedIn !== true) {
        this.router.navigate(['/sign-in']);
        return false;
      }

      return this.authService.afAuth.authState.pipe(mergeMap(user => {
        return combineLatest([of(user), this.backendService.getUser().pipe(map(u => {
          if (u.user.isAdmin) {
            return u.user.isAdmin;
          } else {
            return false;
          }
        }))])
      }),
      map(([resultA, resultB]) => {
          return resultB;
      }));
  }
}