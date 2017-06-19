import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { IUser } from './../../user';
import { AuthService } from './../../auth.service';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-signup-sms',
  templateUrl: './signup-sms.component.html',
  styleUrls: ['./signup-sms.component.css']
})
export class SignupSmsComponent implements OnInit {

  userForm: FormGroup;
  pageTitle: string = 'Add or change your phone number';
  showError: boolean = false;
  showSpinner: boolean = false;
  

  constructor(private _router: Router, private _authService: AuthService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.userForm = this._formBuilder.group({
      phoneNumber: ['', Validators.required],
      countryCode: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

   createUserSMS(formValues) {
     if (this.userForm.valid) {
       this.toggleSpinner();
       formValues.email = localStorage.getItem('email');
       this._authService.createUserSMS(formValues);
     }
   }

   toggleSpinner(){
    return this.showSpinner = !this.showSpinner;
   }

   goBack(): void {
        this._router.navigate(['login']);
    }


}
