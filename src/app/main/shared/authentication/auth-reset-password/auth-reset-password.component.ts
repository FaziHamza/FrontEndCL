import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {CoreConfigService} from '@core/services/config.service';
import {PasswordStrengthValidator} from '../PasswordStrengthValidator';
import {ToastrService} from 'ngx-toastr';
import {AuthenticationService} from "../../../../shared/services/authentication.service";

@Component({
    selector: 'app-auth-reset-password',
    templateUrl: './auth-reset-password.component.html',
    styleUrls: ['./auth-reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthResetPasswordComponent implements OnInit {
    // Public
    public coreConfig: any;
    public passwordTextType: boolean;
    public confPasswordTextType: boolean;
    public resetPasswordForm: FormGroup;
    public submitted = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     * @param _authenticationService
     * @param _toastrService
     * @param {FormBuilder} _formBuilder
     */
    constructor(private _coreConfigService: CoreConfigService,
                private _authenticationService: AuthenticationService,
                private _toastrService: ToastrService,
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
        if (this.f.newPassword.value != this.f.confirmPassword.value) {
            this._toastrService.error('Password or confirm password not match.', 'Password not match.');
            return;
        }
        this.resetPassword(this.f.newPassword.value);

    }

    resetPassword(value) {
        // debugger
        var code = localStorage.getItem('code');
        var userName = localStorage.getItem('userName');

        this._authenticationService.resetPassword(userName, value, code).subscribe(
            (res: any) => {
                if (res) {
                    // this._router.navigate(['/']);
                    localStorage.setItem('token', res.Data.AuthToken);
                }
            },
            err => {
                if (err.status == 400)
                    console.log("Incorrect");

                //   this.toastr.error('Incorrect username or password.', 'Authentication failed.');
                else
                    console.log(err);
            }
        );
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.resetPasswordForm = this._formBuilder.group({
            newPassword: ['', [Validators.required, Validators.minLength(8), PasswordStrengthValidator]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8), PasswordStrengthValidator]]
        });

        // Subscribe to config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
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
