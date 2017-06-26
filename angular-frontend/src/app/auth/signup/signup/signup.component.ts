import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { IUser } from './../../user';
import { AuthService } from './../../auth.service';
import 'rxjs/add/operator/debounceTime';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  userForm: FormGroup;
  pageTitle: string = 'Create new account';
  showError: boolean = false;
  showSpinner: boolean = false;
  validateEmai;

  constructor(private _router: Router, private _authService: AuthService, private _formBuilder: FormBuilder) { }
 
  ngOnInit() {
    this.userForm = this._formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      email: ['', [Validators.required,CustomValidators.email]],
      fullName: ['', Validators.required],
    });
  }

   createUser(formValues) {
     if (this.userForm.valid) {
       this.toggleSpinner();
       this._authService.createUserEmail(formValues);
     }
   }

   toggleSpinner(){
    return this.showSpinner = !this.showSpinner;
   }

   goBack(): void {
        this._router.navigate(['choose-mfa']);
    }


}
