import { NgModule } from '@angular/core';
import { RouterModule, CanActivate } from '@angular/router';
import { AuthGuard } from './auth-guard.service';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup/signup.component';
import { SignupAppComponent } from './signup/signup-app/signup-app.component';
import { SignupSmsComponent } from './signup/signup-sms/signup-sms.component';
import { SignupVerifyComponent } from './signup/signup-verify/signup-verify.component';
import { VerifyComponent } from './verify/verify.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';


@NgModule({
  imports: [RouterModule.forChild([
      { path: 'signup',  component: SignupComponent },
      { path: 'signup/verify',  component: SignupVerifyComponent },
      { path: 'settings/phonenumber',  canActivate: [AuthGuard],component: SignupSmsComponent },
      { path: 'settings/authenticator',  canActivate: [AuthGuard],component: SignupAppComponent },
      { path: 'settings/change-password',  canActivate: [AuthGuard],component: ChangePasswordComponent },
      { path: 'login', component: LoginComponent },
      { path: 'verify', component: VerifyComponent },
    ])],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AuthRoutingModule { }
