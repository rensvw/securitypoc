import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ICodeCredentials } from '../../../auth/codeCredentials';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {Location} from '@angular/common';

@Component({
  selector: 'app-verify-app',
  templateUrl: './verify-app.component.html',
  styleUrls: ['./verify-app.component.css']
})
export class VerifyAppComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _location: Location
    ) {}

    uuid: string;
    verifyType: string;
    codeCredentials;
    verifyForm: FormGroup;
    verifySms: boolean = false;
    verifyEmail: boolean = false;
    verifyApp: boolean = false;
    showSpinner;
    

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
        this.router.navigate(['choose-mfa']);
    }

   verify(formValues){
    this.codeCredentials = {
      uuid: this.uuid,
      code: formValues.code,
      verifyType: this.verifyType
    }
       this._authService.verify(this.codeCredentials);  
       this.verifyForm.reset();
       
      };


}
