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
    private _verifySMSUrl = '/api/verify-sms';
    private _verifyEmailUrl = '/api/verify-email';
    private _verifyAppUrl = '/api/verify-app';    
    private _signupUrl = '/api/signup';
    public token: string;
    private uuid;
    private redirectTo: string;
    private url;
    private succes;


    constructor(private _http: Http, private _router: Router) { }

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
            }
        },
            error => console.log(error),
        () => { 
            if(this.redirectTo == 'home'){
                this._router.navigate(['home']);                
            }
            else if(this.redirectTo == "verifyEmailPage"){
                this._router.navigate(['verify'],{ queryParams: { uuid: this.uuid, verify: "email" } });
            }
            else if(this.redirectTo == "verifySMSPage"){
                this._router.navigate(['verify'],{ queryParams: { uuid: this.uuid, verify: "sms" } });
            }
        }
      );
    }

    verify(credentials){
        const headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        const options       = new RequestOptions({ headers: headers }); // Create a request option

        if(credentials.verifyType == "email"){
            this.url = this._verifyEmailUrl;
        }
        else if(credentials.verifyType == "sms"){
            this.url = this._verifySMSUrl
        }
        else if(credentials.verifyType == "app"){
            this.url = this._verifyAppUrl
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
            else if(this.redirectTo == 'home'){
                this._router.navigate(['home']);    
            }
            else if(this.redirectTo == "verifyEmailPage"){
                this._router.navigate(['verify'],{ queryParams: { uuid: this.uuid, verify: "email" } });
            }
            else if(this.redirectTo == "verifySMSPage"){
                this._router.navigate(['verify'],{ queryParams: { uuid: this.uuid, verify: "sms" } });
            }
        }
      );
    }

    createUser(user): Observable < IUser > {
  return this._http.post(this._signupUrl, user) // ...using post request
    .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
    .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if
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
