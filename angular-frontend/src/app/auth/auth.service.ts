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
    private _signupUrl = '/api/signup';
    private _mfaLogin = '/api/login-mfa'
    public token: string;
    private uuid;
    mfaMethods = [];

    authUrls = [
        {
            name: 'normal',
            id: 2,
            loginUrl: '/api/login'
        },
        {
            name: 'mfa',
            id: 3,
            loginUrl: '/api/login-mfa',
        },
        {
            name: 'email',
            id: 3,
            loginUrl: '/api/login-email',
            verifyUrl: '/api/verify-email'
        },
        {
            name: 'sms',
            id: 4,
            loginUrl: '/api/login-sms',
            verifyUrl: '/api/verify-sms'
        },
        {
            name: 'totp',
            id: 5,
            loginUrl: '/api/login-app',
            verifyUrl: '/api/verify-app'
        },
        {
            name: 'signUp',
            id: 6,
            url: '/api/signup'
        }
    ];

    constructor(private _http: Http, private _router: Router) { }

    authenticateMfa(credentials,authOptions){
         for(let x=0; x<authOptions.length; x++){
            var name = this.authUrls.filter(function ( obj ) {
            return obj.id === authOptions[x];
        })[0];
       console.log(name.name);
       this.mfaMethods.push(name.name);
            
    }
    
    const headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    const options       = new RequestOptions({ headers: headers }); // Create a request option
    
    let mfaObject = {
        credentials: credentials,
        mfaMethods: this.mfaMethods
    }

    return this._http.post(this._mfaLogin, mfaObject)
            .map(res => res.json())
            .subscribe(
        data => {
            for(let i =0; i<this.mfaMethods.length; i++){
                localStorage.setItem("array_index"+i,this.mfaMethods[i])
            }           
            this.uuid = data.uuid;
            },
        error => console.log(error),
        () => { 
            this._router.navigate(['verify']);
        }
      );
    }


    authenticate(credentials){
        const headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        const options       = new RequestOptions({ headers: headers }); // Create a request option
        
        return this._http.post(this._authenticateUrl, credentials)
            .map(res => res.json())
            .subscribe(
        data => {
            localStorage.setItem('token', data.token);
            this.currentUser = data.respond.user; },
        error => console.log(error),
        () => { console.log('Welcome', this.currentUser.fullName + '!');
         this._router.navigate(['home']);
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
