import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ICodeCredentials } from '../../../auth/codeCredentials';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {Location} from '@angular/common';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  pageTitle: string = 'Change your password';



  constructor(private route: ActivatedRoute,
    private router: Router,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _location: Location
    ) {}

  userForm;
signUpForm: FormGroup;
form;
showSpinner;

  ngOnInit() {
    let oldPassword = new FormControl('', [Validators.required, Validators.minLength(8)]);
    let newPassword1 = new FormControl('', [Validators.required, Validators.minLength(8)]);
    let newPassword2 = new FormControl('', [Validators.required,CustomValidators.equalTo(newPassword1), Validators.minLength(8)]);
 
    this.userForm = new FormGroup({
      oldPassword: oldPassword,
      newPassword1: newPassword1,
      newPassword2: newPassword2
    });
  }

   changePassword(formValues){
    formValues.email = localStorage.getItem('email');
    this._authService.changePassword(formValues);  
      };

}