import { NgModule } from '@angular/core';
import { RouterModule, CanActivate } from '@angular/router';
import { AuthGuard } from './auth-guard.service';

import { LoginComponent } from './login/login-normal/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup/signup.component';
import { SignupAppComponent } from './signup/signup-app/signup-app.component';
import { SignupSmsComponent } from './signup/signup-sms/signup-sms.component';
import { SignupVerifyAppComponent } from './signup/signup-verify/verify-app/verify-app.component';
import { SignupVerifyEmailComponent } from './signup/signup-verify/verify-email/verify-email.component';
import { SignupVerifySmsComponent } from './signup/signup-verify/verify-sms/verify-sms.component';
import { VerifyAppComponent } from './verify/verify-app/verify-app.component';
import { VerifyEmailComponent } from './verify/verify-email/verify-email.component';
import { VerifySmsComponent } from './verify/verify-sms/verify-sms.component';
import { ChooseMfaComponent } from './choose-mfa/choose-mfa.component'
import { LoginEmailComponent } from './login/login-email/login-email.component'
import { LoginSmsComponent } from './login/login-sms/login-sms.component'
import { LoginAppComponent } from './login/login-app/login-app.component'
import { LoginTelegramComponent } from './login/login-telegram/login-telegram.component'
import { VerifyNormalComponent } from './verify/verify-normal/verify-normal.component'
import { VerifyTelegramComponent } from './verify/verify-telegram/verify-telegram.component'
import { SignupTelegramComponent } from './signup/signup-telegram/signup-telegram.component';
import { SignupVerifyTelegramComponent } from './signup/signup-verify/verify-telegram/verify-telegram.component';
import { SignupTelegramSubscribeComponent } from './signup/signup-telegram-subscribe/signup-telegram-subscribe.component';

import { ChangePasswordComponent } from './settings/change-password/change-password.component';


@NgModule({
  imports: [RouterModule.forChild([
      { path: 'signup',  component: SignupComponent },
      { path: 'signup/verify/app',  component: SignupVerifyAppComponent },
      { path: 'signup/verify/email',  component: SignupVerifyEmailComponent },
      { path: 'signup/verify/sms',  component: SignupVerifySmsComponent },
      { path: 'signup/verify/telegram',  component: SignupVerifyTelegramComponent },
      { path: 'signup/subscribe/telegram',  component: SignupTelegramSubscribeComponent },
      
      { path: 'settings/phonenumber',  canActivate: [AuthGuard],component: SignupSmsComponent },
      { path: 'settings/authenticator',  canActivate: [AuthGuard],component: SignupAppComponent },
      { path: 'settings/change-password',  canActivate: [AuthGuard],component: ChangePasswordComponent },
      { path: 'settings/telegram',  canActivate: [AuthGuard],component: SignupTelegramComponent },

      { path: 'login', component: LoginComponent },
      { path: 'login/email', component: LoginEmailComponent },
      { path: 'login/sms', component: LoginSmsComponent },
      { path: 'login/app', component: LoginAppComponent },
      { path: 'login/telegram', component: LoginTelegramComponent },
      
      { path: 'choose-mfa', component: ChooseMfaComponent },
      { path: 'verify/app', component: VerifyAppComponent },
      { path: 'verify/sms', component: VerifySmsComponent },
      { path: 'verify/email', component: VerifyEmailComponent },
      { path: 'verify/normal', component: VerifyNormalComponent },
      { path: 'verify/telegram', component: VerifyTelegramComponent },
    ])],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AuthRoutingModule { }
