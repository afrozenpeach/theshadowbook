import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from './environments/environment';
import { AuthService } from './services/auth.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateEmailComponent } from './components/update-email/update-email.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CrystalsComponent } from './components/crystals/crystals.component';
import { CrystalComponent } from './components/crystal/crystal.component';
import { CrystalEditorComponent } from './components/crystal-editor/crystal-editor.component';
import { FourOhFourComponent } from './components/four-oh-four/four-oh-four.component';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { YourCrystalsComponent } from './components/your-crystals/your-crystals.component';
import { YourDecksComponent } from './components/your-decks/your-decks.component';
import { DecksComponent } from './components/decks/decks.component';
import { DeckComponent } from './components/deck/deck.component';
import { DeckEditorComponent } from './components/deck-editor/deck-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    UpdateEmailComponent,
    CrystalsComponent,
    CrystalComponent,
    CrystalEditorComponent,
    FourOhFourComponent,
    YourCrystalsComponent,
    YourDecksComponent,
    DecksComponent,
    DeckComponent,
    DeckEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
