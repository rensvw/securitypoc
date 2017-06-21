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
    private _signupUrlEmail = '/api/signup/email';
    private _signupUrlSMS = '/api/signup/sms';

    private _createUriApp = '/api/signup/app/create/uri'
    private _changePassword = '/api/settings/change-password'

    private _verifySMSUrl = '/api/verify/sms';
    private _verifyEmailUrl = '/api/verify/email';
    private _verifyAppUrl = '/api/verify/app';   
    private _verifySignupSMSUrl = '/api/signup/verify/sms';
    private _verifySignupEmailUrl = '/api/signup/verify/email';
    private _verifySignupAppUrl = '/api/signup/verify/app';

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
                     console.log(error)
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




     authenticate(credentials) {
         const headers = new Headers({
             'Content-Type': 'application/json'
         }); // ... Set content type to JSON
         const options = new RequestOptions({
             headers: headers
         }); // Create a request option
         console.log(credentials)
         return this._http.post(this._authenticateUrl, credentials)
             .map(res => res.json())
             .subscribe(
                 data => {
                     this.redirectTo = data.redirectTo;
                     this.uuid = data.uuid;
                     if(!data.succes){
                         alert("The username or password is incorrect!");
                     }
                     console.log(data)
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
         }

         return this._http.post(this.url, {
                 code: credentials.code,
                 uuid: credentials.uuid
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
                         alert("The code is incorrect! Please try again!")
                         return {
                             succes: false,
                             message: "The code is incorrect!"
                         }
                         
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
