import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { ICodeCredentials } from '../../../../auth/codeCredentials';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {Location} from '@angular/common';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class SignupVerifyEmailComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _location: Location
    ) {}

    uuid;
    verifyType;
    signupCredentials;
    verifyForm;

  ngOnInit() {
    this.verifyForm = this._formBuilder.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
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
  }

   goBack(): void {
        this._location.back();
    }

   verify(formValues){
    this.signupCredentials = {
      uuid: this.uuid,
      code: formValues.code,
      verifyType: this.verifyType
    }
    console.log(this.signupCredentials);
       this._authService.verifySignup(this.signupCredentials);  
       this.verifyForm.reset()
      };


}
