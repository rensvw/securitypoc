import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup/signup.component';
import { SignupSmsComponent } from './signup/signup-sms/signup-sms.component';
import { SignupAppComponent } from './signup/signup-app/signup-app.component';
import { SignupVerifyAppComponent } from './signup/signup-verify/verify-app/verify-app.component';
import { SignupVerifyEmailComponent } from './signup/signup-verify/verify-email/verify-email.component';
import { SignupVerifySmsComponent } from './signup/signup-verify/verify-sms/verify-sms.component';

import { QRCodeModule } from 'angular2-qrcode';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { VerifySmsComponent } from './verify/verify-sms/verify-sms.component';
import { VerifyEmailComponent } from './verify/verify-email/verify-email.component';
import { VerifyAppComponent } from './verify/verify-app/verify-app.component';
import { ChooseMfaComponent } from './choose-mfa/choose-mfa.component';
import { LoginEmailComponent } from './login/login-email/login-email.component';
import { VerifyNormalComponent } from './verify/verify-normal/verify-normal.component';
import { LoginSmsComponent } from './login/login-sms/login-sms.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({tokenName: 'token',
        tokenGetter: (() => sessionStorage.getItem('token')),
        globalHeaders: [{'Content-Type':'application/json'}],
        noJwtError: true
    }), http, options);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  imports: [AuthRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MultiselectDropdownModule,
        QRCodeModule],
    exports: [],
    declarations: [LoginComponent, ProfileComponent, SignupComponent, SignupSmsComponent, SignupAppComponent, SignupVerifyAppComponent,SignupVerifyEmailComponent,SignupVerifySmsComponent, ChangePasswordComponent, VerifySmsComponent, VerifyEmailComponent, VerifyAppComponent, ChooseMfaComponent, LoginEmailComponent, VerifyNormalComponent, LoginSmsComponent]
})

export class AuthModule {
  
}