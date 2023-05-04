import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthGuard } from './guard/auth.guard';
import { UpdateEmailComponent } from './components/update-email/update-email.component';
import { CrystalsComponent } from './components/crystals/crystals.component';
import { CrystalComponent } from './components/crystal/crystal.component';
import { CrystalEditorComponent } from './components/crystal-editor/crystal-editor.component';
import { AdminGuard } from './guard/admin.guard';
import { FourOhFourComponent } from './components/four-oh-four/four-oh-four.component';
import { YourCrystalsComponent } from './components/your-crystals/your-crystals.component';
import { YourDecksComponent } from './components/your-decks/your-decks.component';
import { DecksComponent } from './components/decks/decks.component';
import { DeckEditorComponent } from './components/deck-editor/deck-editor.component';
import { DeckComponent } from './components/deck/deck.component';
import { DropdownEditorComponent } from './components/dropdown-editor/dropdown-editor.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/crystals', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'verify-email-address', component: VerifyEmailComponent},
  { path: 'update-email', component: UpdateEmailComponent, canActivate: [AuthGuard] },
  { path: 'your-crystals', component: YourCrystalsComponent, canActivate: [AuthGuard] },
  { path: 'your-decks', component: YourDecksComponent, canActivate: [AuthGuard] },
  { path: 'crystals', component: CrystalsComponent},
  { path: 'crystals/:name', component: CrystalComponent },
  { path: 'crystal-editor/:id', component: CrystalEditorComponent, canActivate: [AdminGuard] },
  { path: 'decks', component: DecksComponent},
  { path: 'decks/:name', component: DeckComponent },
  { path: 'deck-editor/:id', component: DeckEditorComponent, canActivate: [AdminGuard] },
  { path: 'admin/dropdown-editor', component: DropdownEditorComponent, canActivate: [AdminGuard] },
  { path: 'profile/:name', component: ProfileComponent },
  { path: '**', pathMatch: 'full', component: FourOhFourComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}