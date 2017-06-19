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
    private _verifySMSUrl = '/api/verify/sms';
    private _verifyEmailUrl = '/api/verify/email';
    private _verifyAppUrl = '/api/verify/app';    
    private _signupUrlEmail = '/api/signup/email';
    private _signupUrlSMS = '/api/signup/sms';

    private _createUriApp = '/api/signup/app/create/uri'
    
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

    constructor(private _http: Http, private _router: Router) { }

     createUserEmail(user) {
        return this._http.post(this._signupUrlEmail, user) // ...using post request
            .map((res: Response) => res.json()) 
            .subscribe(
                data => {
                    this.redirectTo = data.redirectTo;
                    this.uuid = data.uuid;
                    console.log(data)
                
                },
            error => console.log(error),
        () => { 
            switch(this.redirectTo){
                case "home":
                    this._router.navigate(['home']);    
                    break;
                case "verifyEmailPage":
                    this._router.navigate(['signup/verify'],{ queryParams: { uuid: this.uuid, verify: "email" } });
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
                    console.log(data)
                },
            error => console.log(error),
        () => { 
            switch(this.redirectTo){
                case "home":
                    this._router.navigate(['home']);    
                    break;
                case "verifySMSPage":
                    this._router.navigate(['signup/verify'],{ queryParams: { uuid: this.uuid, verify: "sms" } });
                    break;
            }
        }
            )
        }   

    createUriApp(email) {
        return this._http.post(this._createUriApp, email) // ...using post request
            .map((res: Response) => res.json()) 
            .subscribe(
                data => {
                    this.uri = data.uri,
                    this.key = data.key
                    console.log(data)
                },
            error => console.log(error),
        () => { 
            switch(this.redirectTo){
                case "home":
                    this._router.navigate(['home']);    
                    break;
                case "verifySMSPage":
                    this._router.navigate(['signup/verify'],{ queryParams: { uuid: this.uuid, verify: "sms" } });
                    break;
            }
        }
            )
        }   
        

    authenticate(credentials){
        const headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        const options       = new RequestOptions({ headers: headers }); // Create a request option
        console.log(credentials)
        return this._http.post(this._authenticateUrl, credentials)
            .map(res => res.json())
            .subscribe(
        data => {
            this.redirectTo = data.redirectTo;
            this.uuid = data.uuid;
            console.log(data)
            if(data.token){
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.email);
            }
        },
            error => console.log(error),
        () => { 
            switch(this.redirectTo){
                case "home":
                    this._router.navigate(['home']);    
                    break;
                case "verifyEmailPage":
                    this._router.navigate(['verify'],{ queryParams: { uuid: this.uuid, verify: "email" } });
                    break;
                case "verifySMSPage":
                    this._router.navigate(['verify'],{ queryParams: { uuid: this.uuid, verify: "sms" } });
                    break;
                case "verifyAppPage":
                    this._router.navigate(['verify'],{ queryParams: { uuid: this.uuid, verify: "app" } });
                    break;
            }
        }
      );
    }

    verify(credentials){
        const headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        const options       = new RequestOptions({ headers: headers }); // Create a request option
        
        switch(credentials.verifyType){
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
               
        return this._http.post(this.url, {code: credentials.code, uuid: credentials.uuid})
            .map(res => res.json())
            .subscribe(
        data => {
            this.redirectTo = data.redirectTo;
            this.succes = data.succes;
            this.uuid = data.uuid;
            if(data.token){
                console.log("TOKEN:",data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.email);
                
            }
        },
            error => console.log(error),
        () => { 
            if(!this.succes){
                return {
                    succes: false,
                    message: "The code is incorrect!"
                }           
            }
            switch(this.redirectTo){
                case "home":
                    this._router.navigate(['home']);    
                    break;
                case "verifyEmailPage":
                    this._router.navigate(['verify'],{ queryParams: { uuid: this.uuid, verify: "email" } });
                    break;
                case "verifySMSPage":
                    this._router.navigate(['verify'],{ queryParams: { uuid: this.uuid, verify: "sms" } });
                    break;
                case "verifyAppPage":
                    this._router.navigate(['verify'],{ queryParams: { uuid: this.uuid, verify: "app" } });
                    break;
            }
        }
      );
    }

    verifySignup(credentials){
        let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        
        headers.append('Authorization','Bearer ' + localStorage.getItem('token') );// ... Set content type to JSON
        const options       = new RequestOptions({ headers: headers }); // Create a request option
        
        switch(credentials.verifyType){
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
               
        return this._http.post(this.url, {code: credentials.code, uuid: credentials.uuid}, options)
            .map(res => res.json())
            .subscribe(
        data => {
            this.succes = data.succes;
            this.redirectTo = data.redirectTo;
            this.uuid = data.uuid;
            if(data.token){
                console.log("TOKEN:",data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.email);
                
            }
        },
            error => console.log(error),
        () => { 
            if(!this.succes){
                return {
                    succes: false,
                    message: "The code is incorrect!"
                }        
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

    logout(){
        localStorage.removeItem('token');
        this.currentUser = null;
        return tokenNotExpired();
    }

    updateCurrentUser(fullName:string){
        this.currentUser.fullName = fullName;
    }
}
