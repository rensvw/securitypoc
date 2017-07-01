import { Injectable } from '@angular/core';
import { IUser } from './user';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ICredentials } from './credentials';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';


@Injectable()
export class AuthService {

    currentUser: any;
    private _authenticateUrl = '/api/login';
    private _authenticateEmailUrl = 'api/login/email';
    private _authenticateSMSUrl = 'api/login/sms';
    private _authenticateAppUrl = 'api/login/app';
    private _authenticateTelegramUrl = '/api/login/telegram';
    private _verifySubscribedTelegramChat = '/api/signup/send/telegram';

    private _signupUrlEmail = '/api/signup/email';
    private _signupUrlSMS = '/api/signup/sms';
    private _signupUrlTelegram = '/api/signup/telegram';

    private _createUriApp = '/api/signup/app/create/uri';
    private _changePassword = '/api/settings/change-password';

    private _verifySMSUrl = '/api/verify/sms';
    private _verifyEmailUrl = '/api/verify/email';
    private _verifyAppUrl = '/api/verify/app';   
    private _verifyNormalUrl = '/api/verify/normal'
    private _verifyTelegramUrl = '/api/verify/telegram'

    private _verifySignupSMSUrl = '/api/signup/verify/sms';
    private _verifySignupEmailUrl = '/api/signup/verify/email';
    private _verifySignupAppUrl = '/api/signup/verify/app';
    private _verifySignupTelegramUrl = '/api/signup/verify/telegram';

    public token: string;
    private uuid;
    private redirectTo: string;
    private url;
    private succes;
    private email;
    private uri;
    private key;
    private error;
    private message;
    private mfa;

    constructor(private _http: Http, private _router: Router) { }

    changePassword(user){
        return this._http.post(this._changePassword, user)
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    this.succes = data.succes;
                    if(!data.succes){
                        alert(data.message);
                    }
                 },
                 error => console.log(error),
                 () => {
                     if (this.succes) {
                         this._router.navigate(['home']);
                         alert("Password succesfully changed!")
                     }
                     else{
                         alert("something went wrong!")
                     }


                 }
                
            )
    }



     createUserEmail(user) {
         return this._http.post(this._signupUrlEmail, user) // ...using post request
             .map((res: Response) => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                     this.succes = data.succes
                     this.message = data.message;
                      if(data.succes == false){
                         alert(data.message)
                     }
                 },
                 error => {
                    this.error = JSON.parse(error._body)     
                    alert("The email adres you provided isn't a valid email adres!")
                 },
                 () => {
                     switch (this.redirectTo) {
                         case "home":
                             this._router.navigate(['home']);
                             break;
                         case "verifyEmailPage":
                             this._router.navigate(['signup/verify/email'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "email"
                                 }
                             });
                             break;
                     }
                 }
             )
     }

     createUserSMS(user) {
         return this._http.post(this._signupUrlSMS, user) // ...using post request
             .map((res: Response) => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                     if(data.succes == false){
                         alert(data.message)
                     }
                 },
                 error => {
                     alert("This phonenumber is already registered!")
                 },
                 () => {
                     switch (this.redirectTo) {
                         case "home":
                             this._router.navigate(['home']);
                             break;
                         case "verifySMSPage":
                             this._router.navigate(['signup/verify/sms'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "sms"
                                 }
                             });
                             break;
                     }
                 }
             )
     }

     createUserTelegram(user) {
         return this._http.post(this._signupUrlTelegram, user) // ...using post request
             .map((res: Response) => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                     if(data.succes == false){
                         alert(data.message)
                     }
                 },
                 error => {
                     alert("This token is already registered!")
                 },
                 () => {
                     switch (this.redirectTo) {
                         case "home":
                             this._router.navigate(['home']);
                             break;
                         case "subscribeTelegramChat":
                             this._router.navigate(['signup/subscribe/telegram'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "telegram"
                                 }
                             });
                             break;
                     }
                 }
             )
     }

      verifySubscriptionTelegram(user) {
         return this._http.post(this._verifySubscribedTelegramChat, user) // ...using post request
             .map((res: Response) => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                     if(data.succes == false){
                         alert(data.message)
                     }
                 },
                 error => {
                     console.log(error)
                     alert("Something wen't wrong!")
                 },
                 () => {
                     switch (this.redirectTo) {
                         case "home":
                             this._router.navigate(['home']);
                             break;
                         case "verifyTelegramPage":
                             this._router.navigate(['signup/verify/telegram'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "telegram"
                                 }
                             });
                             break;
                     }
                 }
             )
     }

     createUserApp(settings) {

         return this._http.post(this._verifySignupAppUrl, settings) // ...using post request
             .map((res: Response) => res.json())
             .subscribe(
                 data => {
                     this.succes = data.succes;
                     if(!data.succes){
                         alert(data.message)
                     }
                 },
                 error => console.log(error),
                 () => {
                     if (this.succes) {
                         alert("Your authenticator app is verified and registered!")
                         this._router.navigate(['home']);
                     }


                 }

             )
     }


     chooseMfa(options){
        for(let x=0; x<options.length;x++){
            if(options[x]==1){
                // Dont run this one
                this._router.navigate(['login'], {
                                 queryParams: {
                                     mfa: options
                                 }
                             });
                break;
            }
            else if(options[x]==2){
                // user pass
                // starts wit huser passs and then proceed with the next
                this._router.navigate(['login'], {
                                 queryParams: {
                                     mfa: options
                                 }
                             });
                break;
            }
            else if(options[x]==3){
                // email
                this._router.navigate(['login/email'], {
                                 queryParams: {
                                     mfa: options
                                 }
                             });
                break;
            }
            else if(options[x]==4){
                //sms
                this._router.navigate(['login/sms'], {
                                 queryParams: {
                                     mfa: options
                                 }
                             });
                break;
            }
            else if(options[x]==5){
                // app
                this._router.navigate(['login/app'], {
                                 queryParams: {
                                     mfa: options
                                 }
                             });
                break;
            }else if(options[x]==6){
                // app
                this._router.navigate(['login/telegram'], {
                                 queryParams: {
                                     mfa: options
                                 }
                             });
                break;
            }
        }
     }

     authenticate(credentials) {
         const headers = new Headers({
             'Content-Type': 'application/json'
         }); // ... Set content type to JSON
         const options = new RequestOptions({
             headers: headers
         }); // Create a request option
         return this._http.post(this._authenticateUrl, credentials)
             .map(res => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                     if(!data.succes){
                         alert("The username or password is incorrect!");
                     }
                     if (data.token) {
                         localStorage.setItem('token', data.token);
                         localStorage.setItem('email', data.email);
                         localStorage.setItem('name', data.fullName);                         
                     }
                 },
                 error => {
                     console.log(error)
                     alert("The username or password is incorrect!")
                 },
                 () => {
                     switch (this.redirectTo) {
                         case "home":
                             this._router.navigate(['home']);
                             break;
                         case "verifyEmailPage":
                             this._router.navigate(['verify/email'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "email"
                                 }
                             });
                             break;
                         case "verifySMSPage":
                             this._router.navigate(['verify/sms'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "sms"
                                 }
                             });
                             break;
                         case "verifyAppPage":
                             this._router.navigate(['verify/app'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "app"
                                 }
                             });
                             break;
                        case "verifyTelegramPage":
                             this._router.navigate(['verify/telegram'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "telegram"
                                 }
                             });
                             break;
                     }
                 }
             );
     }

     authenticateEmail(credentials) {
         const headers = new Headers({
             'Content-Type': 'application/json'
         }); // ... Set content type to JSON
         const options = new RequestOptions({
             headers: headers
         }); // Create a request option
         return this._http.post(this._authenticateEmailUrl, credentials)
             .map(res => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                     this.mfa = data.mfa;
                     if(!data.succes){
                         alert("This email address could not been found!");
                     }
                     if (data.token) {
                         localStorage.setItem('token', data.token);
                         localStorage.setItem('email', data.email);
                         localStorage.setItem('name', data.fullName);                         
                     }
                 },
                 error => {
                     console.log(error)
                     alert("Tis email address doesn't exist!")
                 },
                 () => {
                     switch (this.redirectTo) {
                         case "verifyEmailPage":
                             this._router.navigate(['verify/email'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "email",
                                     mfa: this.mfa
                                 }
                             });
                             break;
                     }
                 }
             );
     }

      authenticateSMS(credentials) {
         const headers = new Headers({
             'Content-Type': 'application/json'
         }); // ... Set content type to JSON
         const options = new RequestOptions({
             headers: headers
         }); // Create a request option
         return this._http.post(this._authenticateSMSUrl, credentials)
             .map(res => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                     this.mfa = data.mfa;
                     if(!data.succes){
                         alert("This phone number could not been found!");
                     }
                     if (data.token) {
                         localStorage.setItem('token', data.token);
                         localStorage.setItem('email', data.email);
                         localStorage.setItem('name', data.fullName);                         
                     }
                 },
                 error => {
                     console.log(error)
                     alert("This phone number doesn't exist!")
                 },
                 () => {
                     switch (this.redirectTo) {
                         case "verifySMSPage":
                             this._router.navigate(['verify/sms'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "sms",
                                     mfa: this.mfa
                                 }
                             });
                             break;
                     }
                 }
             );
     }

     authenticateTelegram(credentials) {
         const headers = new Headers({
             'Content-Type': 'application/json'
         }); // ... Set content type to JSON
         const options = new RequestOptions({
             headers: headers
         }); // Create a request option
         return this._http.post(this._authenticateTelegramUrl, credentials)
             .map(res => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                     this.mfa = data.mfa;
                     if(!data.succes){
                         alert("This telegram account could not been found!");
                     }
                     if (data.token) {
                         localStorage.setItem('token', data.token);
                         localStorage.setItem('email', data.email);
                         localStorage.setItem('name', data.fullName);                         
                     }
                 },
                 error => {
                     console.log(error)
                     alert("This phone number doesn't exist!")
                 },
                 () => {
                     switch (this.redirectTo) {
                         case "verifyTelegramPage":
                             this._router.navigate(['verify/telegram'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "telegram",
                                     mfa: this.mfa
                                 }
                             });
                             break;
                     }
                 }
             );
     }

     authenticateApp(credentials) {
         const headers = new Headers({
             'Content-Type': 'application/json'
         }); // ... Set content type to JSON
         const options = new RequestOptions({
             headers: headers
         }); // Create a request option
         return this._http.post(this._authenticateAppUrl, credentials)
             .map(res => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                     this.mfa = data.mfa;
                     if(!data.succes){
                         alert("This email address could not been found!");
                     }
                     if (data.token) {
                         localStorage.setItem('token', data.token);
                         localStorage.setItem('email', data.email);
                         localStorage.setItem('name', data.fullName);                         
                     }
                 },
                 error => {
                     console.log(error)
                     alert("This email address doesn't exist!")
                 },
                 () => {
                     switch (this.redirectTo) {
                         case "verifyAppPage":
                             this._router.navigate(['verify/app'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "app",
                                     mfa: this.mfa
                                 }
                             });
                             break;
                     }
                 }
             );
     }



     verify(credentials) {
         const headers = new Headers({
             'Content-Type': 'application/json'
         }); // ... Set content type to JSON
         const options = new RequestOptions({
             headers: headers
         }); // Create a request option

         switch (credentials.verifyType) {
             case "email":
                 this.url = this._verifyEmailUrl;
                 break;
             case "sms":
                 this.url = this._verifySMSUrl;
                 break;
             case "app":
                 this.url = this._verifyAppUrl;
                 break;
             case "normal":
                 this.url = this._verifyNormalUrl;
                 break;
            case "telegram":
                 this.url = this._verifyTelegramUrl;
                 break;
         }

         return this._http.post(this.url, {
                 code: credentials.code,
                 uuid: credentials.uuid,
                 email: credentials.email || undefined,
                 password: credentials.password || undefined
             })
             .map(res => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.succes = data.succes;
                     this.uuid = data.uuid;
                     if (data.token) {
                         localStorage.setItem('token', data.token);
                         localStorage.setItem('email', data.email);
                         localStorage.setItem('name', data.fullName);
                         

                     }
                 },
                 error => console.log(error),
                 () => {
                     if (!this.succes) {
                         alert("The verification is incorrect! Please try again!")
                                                 
                     }
                     switch (this.redirectTo) {
                         case "home":
                             this._router.navigate(['home']);
                             break;
                         case "verifyEmailPage":
                             this._router.navigate(['verify/email'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "email"
                                 }
                             });
                             break;
                         case "verifySMSPage":
                             this._router.navigate(['verify/sms'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "sms"
                                 }
                             });
                             break;
                         case "verifyAppPage":
                             this._router.navigate(['verify/app'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "app"
                                 }
                             });
                             break;
                          case "verifyNormalPage":
                             this._router.navigate(['verify/normal'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "normal"
                                 }
                             });
                             break;
                        case "verifyTelegramPage":
                             this._router.navigate(['verify/telegram'], {
                                 queryParams: {
                                     uuid: this.uuid,
                                     verify: "telegram"
                                 }
                             });
                             break;
                     }
                 }
             );
     }

     verifySignup(credentials) {
         let headers = new Headers({
             'Content-Type': 'application/json'
         }); // ... Set content type to JSON

         headers.append('Authorization', 'Bearer ' + localStorage.getItem('token')); // ... Set content type to JSON
         const options = new RequestOptions({
             headers: headers
         }); // Create a request option

         switch (credentials.verifyType) {
             case "email":
                 this.url = this._verifySignupEmailUrl;
                 break;
             case "sms":
                 this.url = this._verifySignupSMSUrl;
                 break;
             case "app":
                 this.url = this._verifySignupAppUrl;
                 break;
            case "telegram":
                 this.url = this._verifySignupTelegramUrl;
                 break;
         }

         return this._http.post(this.url, {
                 code: credentials.code,
                 uuid: credentials.uuid
             }, options)
             .map(res => res.json())
             .subscribe(
                 data => {
                     this.succes = data.succes;
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                      if(data.succes == false){
                         alert(data.message)
                     }
                 },
                 error => console.log(error),
                 () => {
                     if (!this.succes) {
                         alert("The code is incorrect! Please try again!")
                         return {
                             succes: false,
                             message: "The code is incorrect!"
                         }
                     }
                      switch (credentials.verifyType) {
                            case "email":
                                alert("Your email is verified and registered!")
                                break;
                            case "sms":
                                alert("Your phonenumber is verified and registered!")
                                break;
                            case "app":
                                alert("Your authenticator app is verified and registered!")
                                break;
                            case "telegram":
                                alert("Your telegram account is verified and registered!")
                                break;
                        }
                     this._router.navigate(['home']);
                     
                       
                 }
             );
     }



     private handleError(error: Response) {
         console.error(error);
         return Observable.throw(error.json().error || 'Server error');
     }

     isAuthenticated() {
         return !!localStorage.getItem('token');
     }

     logout() {
         localStorage.removeItem('token');
         this.currentUser = null;
         return tokenNotExpired();
     }

     updateCurrentUser(fullName: string) {
         this.currentUser.fullName = fullName;
     }
     }
