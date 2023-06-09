import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BackendService } from './backend.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public backendService: BackendService
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.removeItem('user');
      }
    });
  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signOut()
      .then(() => {
        this.afAuth.signInWithEmailAndPassword(email, password)
        .then(() => {
          this.afAuth.authState.subscribe(user => {
            if (user) {
              this.router.navigate(['/dashboard']);
            }
          })
        })
        .catch((error) => {
          window.alert(error.message);
        });
      });
  }
  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail().then(() => {
          this.SetUserData(result.user).then(() => {
            this.afAuth.signOut().then(() => {
              localStorage.removeItem('user');
              this.router.navigate(['/sign-in']);
            })
          })
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Update email
  UpdateEmail(oldEmail: string, newEmail: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(oldEmail, password)
      .then(result => {
        this.afAuth.currentUser.then(user => {
          user?.updateEmail(newEmail).then(result => {
            this.backendService.getUser().subscribe(data => {
              if (data.user.id !== undefined) {
                this.backendService.updateUser({
                  id: data.user.id,
                  email: newEmail
                })
              }
            });
            this.SendVerificationMail();
          })
        })
      })
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['sign-in']);
    });
  }
  //Is Admin
  get IsAdmin(): Observable<boolean> {
    return this.backendService.getUser().pipe(map(u => {return u.user.isAdmin ? true : false}));
  }
}
