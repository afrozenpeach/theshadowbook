import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private afAuth: AngularFireAuth) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.afAuth.currentUser.then(u => u?.getIdToken())).pipe(
            switchMap(token => {
                let authReq: any;

                if (token !== undefined) {
                    authReq = request.clone({
                        headers: request.headers.set('Authorization', 'Bearer ' + token)
                    });
                } else {
                    authReq = request.clone();
                };

                return next.handle(authReq).pipe(catchError(err => {
                    if ([401, 403].includes(err.status) && this.authService.isLoggedIn) {
                        // auto logout if 401 or 403 response returned from api
                        this.authService.SignOut();
                    }

                    const error = err.error?.message || err.statusText;
                    return throwError(() => error);
                }));
            }));
    }
}
