import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { ICredentials } from './../credentials';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  pageTitle: string = "Login Page";
  credentials: ICredentials;
  email: string;
  password: string;
  optionsModel: number[]
  myOptions: IMultiSelectOption[]
  myTexts: IMultiSelectTexts
  mySettings: IMultiSelectSettings

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit() {
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
];
 console.log(this.optionsModel);
  }

  
 onChange() {
        console.log(this.optionsModel);
    }
  authenticate(formValues){
    this.credentials = {
      email: formValues.email,
      password: formValues.password,
      sms: 1,
      mail: 1,
      app: 1
    }
    let loginOptions = this.optionsModel;
    if(loginOptions.length === 1 && loginOptions[0] === 2){
      this._authService.authenticate(this.credentials);
    }
    else{
      console.log(loginOptions)
        if(loginOptions.includes(3)){
          this.credentials.mail = 0;
        }
        if(loginOptions.includes(4)){
          this.credentials.sms = 0;
        }
        if(loginOptions.includes(5)){
          this.credentials.app = 0;
        }
       this._authService.authenticate(this.credentials);   
       console.log(this.credentials)  
      }
    }
  };



