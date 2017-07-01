import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { ICredentials } from './../credentials';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-choose-mfa',
  templateUrl: './choose-mfa.component.html',
  styleUrls: ['./choose-mfa.component.css']
})
export class ChooseMfaComponent implements OnInit {

  pageTitle: string = "Login Page";
  credentials: ICredentials;
  email: string;
  password: string;
  optionsModel: number[]
  myOptions: IMultiSelectOption[]
  myTexts: IMultiSelectTexts
  mySettings: IMultiSelectSettings
  loginForm;
  showSpinner;

  constructor(private _authService: AuthService, private _router: Router, private _formBuilder: FormBuilder) { }

  ngOnInit() {

    let email = new FormControl('', [Validators.required,CustomValidators.email]);
    let password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    
 
    this.loginForm = new FormGroup({
      email: email,
      password: password,
    });

    this.optionsModel = [2];
    this.mySettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
};

    this.myTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    defaultTitle: 'Select',
    allSelected: 'All selected',
};
        this.myOptions = [
    { id: 1, name: 'Multifactor authentication methods', isLabel: true },
    { id: 2, name: 'Normal Authentication', parentId: 1 },
    { id: 3, name: 'Email Authentication', parentId: 1 },
    { id: 4, name: 'Sms Authentication', parentId: 1 },
    { id: 5, name: 'Authenticator App', parentId: 1 },
    { id: 6, name: 'Telegram Authentication', parentId: 1 },
];
  }

  
  onChange(event) {
        //console.log(this.optionsModel);
    }
    
  authenticate(formValues){
   
       this._authService.chooseMfa(this.optionsModel);   
       //console.log(this.credentials)  
      }
    
  };



