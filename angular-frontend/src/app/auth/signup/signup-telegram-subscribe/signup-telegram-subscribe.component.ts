import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { IUser } from './../../user';
import { AuthService } from './../../auth.service';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-signup-telegram-subscribe',
  templateUrl: './signup-telegram-subscribe.component.html',
  styleUrls: ['./signup-telegram-subscribe.component.css']
})
export class SignupTelegramSubscribeComponent implements OnInit {

  userForm: FormGroup;
  pageTitle: string = 'Subscribe your chat to your account!';
  showError: boolean = false;
  showSpinner: boolean = false;
  data = {
    email: ''
  };

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  
  }

   createUserTelegram() {
     this.data.email = localStorage.getItem('email');
     console.log(this.data)
     this._authService.verifySubscriptionTelegram(this.data)
   }

}
