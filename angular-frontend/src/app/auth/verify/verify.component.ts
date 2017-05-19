import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ICodeCredentials } from '../../auth/codeCredentials';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private _authService: AuthService) {}

    uuid;
    verifyType;
    codeCredentials;


  ngOnInit() {
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

   verify(formValues){
    this.codeCredentials = {
      uuid: this.uuid,
      code: formValues.code,
      verifyType: this.verifyType
    }
    console.log(this.verifyType)
    console.log(this.uuid)
    
       this._authService.verify(this.codeCredentials);     
      };

}
