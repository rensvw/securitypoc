import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { ICredentials } from './../../credentials';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';


@Component({
  selector: 'app-login-email',
  templateUrl: './login-email.component.html',
  styleUrls: ['./login-email.component.css']
})
export class LoginEmailComponent implements OnInit {

   pageTitle: string = "Login with your email address";
  credentials
  email: string;
  loginForm;
  showSpinner;
  mfa;
  
  constructor(private _authService: AuthService, private _router: Router, private _formBuilder: FormBuilder,private route: ActivatedRoute,) { }

  ngOnInit() {

    let email = new FormControl('', [Validators.required,CustomValidators.email]);
     
     this.route
      .queryParams
      .subscribe((params: Params) => {
        this.mfa = params['mfa'];   
    });

 
    this.loginForm = new FormGroup({
      email: email
    });

 
  }

     goBack(): void {
        this._router.navigate(['choose-mfa']);
    }
  
    
  authenticate(formValues){
    this.credentials = {
      email: formValues.email,
      sms: 1,
      mail: 1,
      app: 1,
      normal: 1,
      telegram: 1,
      mfa: this.mfa
    }
        if(this.mfa.includes('2')){
          this.credentials.normal = 0;
        }
        if(this.mfa.includes('4')){
          this.credentials.sms = 0;
        }
        if(this.mfa.includes('5')){
          this.credentials.app = 0;
        }if(this.mfa.includes('6')){
          this.credentials.telegram = 0;
        }
    
       this._authService.authenticateEmail(this.credentials);   
      
    }
  };
