import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import { Router, Params, ActivatedRoute} from '@angular/router';
import { ICredentials } from './../../credentials';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  pageTitle: string = "Login with username and password";
  credentials;
  email: string;
  password: string;
  optionsModel: number[]
  myOptions: IMultiSelectOption[]
  myTexts: IMultiSelectTexts
  mySettings: IMultiSelectSettings
  loginForm;
  showSpinner;
  mfa;

  constructor(private _authService: AuthService, private _router: Router, private _formBuilder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {

    let email = new FormControl('', [Validators.required,CustomValidators.email]);
    let password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    
     this.route
      .queryParams
      .subscribe((params: Params) => {
        this.mfa = params['mfa'];   
        this.mfa.splice(0,1); 
        console.log(this.mfa)
    });
 
    this.loginForm = new FormGroup({
      email: email,
      password: password,
    });

 
  }

  
   goBack(): void {
        this._router.navigate(['choose-mfa']);
    }

    
  authenticate(formValues){
     this.credentials = {
      email: formValues.email,
      password: formValues.password,
      sms: 1,
      mail: 1,
      app: 1,
      normal: 1,
      telegram: 1,
      mfa: this.mfa
    }
        if(this.mfa.includes('3')){
          this.credentials.mail = 0;
        }
        if(this.mfa.includes('4')){
          this.credentials.sms = 0;
        }
        if(this.mfa.includes('5')){
          this.credentials.app = 0;
        }
        if(this.mfa.includes('6')){
          this.credentials.telegram = 0;
        }
    
       this._authService.authenticate(this.credentials);   
       console.log(this.credentials)  
      
    }
  };



