import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import { Router, Params, ActivatedRoute} from '@angular/router';
import { ICredentials } from './../../credentials';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-login',
  templateUrl: './verify-normal.component.html',
  styleUrls: ['./verify-normal.component.css']
})
export class VerifyNormalComponent implements OnInit {

  pageTitle: string = "Verify your username and password";
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
  uuid;
  verifyType;

  constructor(private _authService: AuthService, private _router: Router, private _formBuilder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {

    let email = new FormControl('', [Validators.required,CustomValidators.email]);
    let password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    
     this.route
      .queryParams
      .subscribe((params: Params) => {
        this.mfa = params['mfa'];   
      //  this.mfa.splice(0,1); 
    });

    this.route
      .queryParams
      .subscribe((params: Params) => {
        this.uuid = params['uuid'];       
    });
    this.route
    .queryParams
      .subscribe((params: Params) => {
        this.verifyType = params['verify'];       
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
      uuid: this.uuid,
      verifyType: this.verifyType
    }

       this._authService.verify(this.credentials);   
      
    }
  };





