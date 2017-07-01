
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { ICredentials } from './../../credentials';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';


@Component({
  selector: 'app-login-sms',
  templateUrl: './login-sms.component.html',
  styleUrls: ['./login-sms.component.css']
})
export class LoginSmsComponent implements OnInit {

   pageTitle: string = "Login with a phone number";
  credentials
  email: string;
  loginForm;
  showSpinner;
  mfa;
  
  constructor(private _authService: AuthService, private _router: Router, private _formBuilder: FormBuilder,private route: ActivatedRoute,) { }

  ngOnInit() {

    let phoneNumber = new FormControl('', [Validators.required]);
     
     this.route
      .queryParams
      .subscribe((params: Params) => {
        this.mfa = params['mfa'];   
    });

 
    this.loginForm = new FormGroup({
      phoneNumber: phoneNumber
    });

 
  }

  
     goBack(): void {
        this._router.navigate(['choose-mfa']);
    }
    
  authenticate(formValues){
    this.credentials = {
      phoneNumber: formValues.phoneNumber,
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
        if(this.mfa.includes('3')){
          this.credentials.mail = 0;
        }
        if(this.mfa.includes('5')){
          this.credentials.app = 0;
        }
        if(this.mfa.includes('6')){
          this.credentials.telegram = 0;
        }
    
       this._authService.authenticateSMS(this.credentials);   
      
    }
  };
