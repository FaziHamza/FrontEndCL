import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {CoreConfigService} from '@core/services/config.service';
import { UserAuthService } from 'app/auth/service/user-auth.service';
import { Router } from '@angular/router';
import {AuthenticationService} from "../../../../shared/services/authentication.service";

@Component({
  selector: 'app-emailconfirmation',
  templateUrl: './emailconfirmation.component.html',
  styleUrls: ['./emailconfirmation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailconfirmationComponent implements OnInit {
    // Public
    public coreConfig: any;
    public passwordTextType: boolean;
    public confPasswordTextType: boolean;
    public resetPasswordForm: FormGroup;
    public submitted = false;

    // Private
    private _unsubscribeAll: Subject<any>;
    public alerMessage ="";

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(private _coreConfigService: CoreConfigService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder) {
        this._unsubscribeAll = new Subject();

        // Configure the layout
        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                menu: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                customizer: false,
                enableLocalStorage: false
            }
        };
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.resetPasswordForm.controls;
    }

    /**
     * Toggle password
     */
    togglePasswordTextType() {
        this.passwordTextType = !this.passwordTextType;
    }

    /**
     * Toggle confirm password
     */
    toggleConfPasswordTextType() {
        this.confPasswordTextType = !this.confPasswordTextType;
    }

    /**
     * On Submit
     */
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }


    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {


        // Subscribe to config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
        this.redirect();

    }
    redirect() {
      // debugger
      var urlParams = new URLSearchParams(window.location.search);
      // console.log(urlParams.has('code'))
      var code = urlParams.get('code');
      var email = urlParams.get('email');
      if (urlParams.has('code'))
        this.IsVerify(code, email);

    }
    IsVerify(code , email) {
      this._authenticationService.IsVerify(code,email).subscribe(
          (res: any) => {

              if (res) {
                this.alerMessage ="Email Confirm you may sing in or used account."
                  // this._router.navigate(["/authentication/login"]);
              }else{
                this.alerMessage ="found some error."

              }
          },
          err => {
              if (err.status == 400)
              {
                  console.log("Incorrect");
                  this.alerMessage ="found some error."
              }
              //   this.toastr.error('Incorrect username or password.', 'Authentication failed.');
              else{
                this.alerMessage ="found some error."
                console.log(err);
              }
          }
      );
  }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
