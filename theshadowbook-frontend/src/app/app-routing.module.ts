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

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'update-email', component: UpdateEmailComponent},
  { path: 'crystals', component: CrystalsComponent, canActivate: [AuthGuard] },
  { path: 'crystals/:name', component: CrystalComponent, canActivate: [AuthGuard] },
  { path: 'crystal-editor/:id', component: CrystalEditorComponent, canActivate: [AuthGuard] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}