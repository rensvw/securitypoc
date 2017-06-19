import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { IUser } from './../../user';
import { AuthService } from './../../auth.service';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-signup-app',
  templateUrl: './signup-app.component.html',
  styleUrls: ['./signup-app.component.css']
})
export class SignupAppComponent implements OnInit {

  userForm: FormGroup;
  pageTitle: string = 'Add or change your authenticator app';
  showError: boolean = false;
  showSpinner: boolean = false;
  uri;
  key;
  QRCode;
  showQR;
  data = { email:null};
  email;

  private _createUriApp = '/api/signup/app/create/uri'

  constructor(private _http: Http, private _router: Router, private _authService: AuthService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.userForm = this._formBuilder.group({
      code: ['', Validators.required],
      password: ['', Validators.required]
    });
      this.email = localStorage.getItem('email');

        this._http.get(encodeURI(this._createUriApp + '?'+ 'email='+ this.email )) // ...using post request
            .map((res: Response) => res.json()) 
            .subscribe(
                data => {
                    this.uri = data.uri,
                    this.key = data.key
                    this.email = data.email
                },
            error => console.log(error),
            ()=>{
              this.showQR = true;
            })  
  }


  createUserApp(formValues) {
     if (this.userForm.valid) {
       this.toggleSpinner();
       formValues.secret = this.key;
       formValues.email = this.email;  
       console.log(formValues);     
       this._authService.createUserApp(formValues);
     }
   }

   toggleSpinner(){
    return this.showSpinner = !this.showSpinner;
   }

   goBack(): void {
        this._router.navigate(['login']);
    }


}
