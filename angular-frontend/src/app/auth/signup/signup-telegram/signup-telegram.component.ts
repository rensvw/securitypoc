import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { IUser } from './../../user';
import { AuthService } from './../../auth.service';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-signup-telegram',
  templateUrl: './signup-telegram.component.html',
  styleUrls: ['./signup-telegram.component.css']
})
export class SignupTelegramComponent implements OnInit {

  userForm: FormGroup;
  pageTitle: string = 'Add or change your telegram account';
  showError: boolean = false;
  showSpinner: boolean = false;
  

  constructor(private _router: Router, private _authService: AuthService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.userForm = this._formBuilder.group({
      token: ['', Validators.required],
      password: ['', [Validators.required,Validators.minLength(8)]]
    });
  }

   createUserTelegram(formValues) {
     if (this.userForm.valid) {
       this.toggleSpinner();
       formValues.email = localStorage.getItem('email');
       this._authService.createUserTelegram(formValues);
     }
   }

   toggleSpinner(){
    return this.showSpinner = !this.showSpinner;
   }

   goBack(): void {
        this._router.navigate(['home']);
    }


}
