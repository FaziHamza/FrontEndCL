import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup} from '@angular/forms';

import {catchError, debounceTime, distinctUntilChanged, first, map, switchMap, takeUntil} from 'rxjs/operators';
import {of, Subject} from 'rxjs';

import {CoreConfigService} from '@core/services/config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {validate, validateControl} from 'app/shared/models/helpers';
import {PasswordValidators} from "ngx-validators";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {AuthenticationService} from "../../../../shared/services/authentication.service";
import {repeaterAnimation} from "../../../../../@core/animations/core.animation";
import { EncryptionService } from 'app/shared/services/encryption.service';

@Component({
    selector: 'app-auth-register',
    templateUrl: './auth-register.component.html',
    styleUrls: ['./auth-register.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None
})
export class AuthRegisterComponent implements OnInit {
    // Public
    public coreConfig: any;
    public passwordTextType: boolean;
    public cPasswordTextType: boolean;

    @BlockUI('register-section') cardBlockUI: NgBlockUI;

    public registerForm: FormGroup = this._formBuilder.group({
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNo: '',
        email: this._formBuilder.control("", {
            asyncValidators: this.validateEmail(this._authenticationService).bind(this)
        }),
        password: '',
        cPassword: '',
    }, {validators: [PasswordValidators.mismatchedPasswords('password', 'cPassword')]});
    public submitted = false;
    public returnUrl: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     * @param {FormBuilder} _formBuilder
     * @param _authenticationService
     * @param _router
     * @param _route
     * @param _toastrService
     * @param cd
     */
    constructor(private _coreConfigService: CoreConfigService, private _formBuilder: FormBuilder,
                private _authenticationService: AuthenticationService,
                private _router: Router,
                private _route: ActivatedRoute, private _toastrService: ToastrService, cd: ChangeDetectorRef,
                public _encryptionService :EncryptionService
    ) {
        // this.registerForm.controls.email.statusChanges.subscribe(() => cd.markForCheck());
        this._unsubscribeAll = new Subject();
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

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
        return this.registerForm.controls;
    }

    // emailValidate(control: FormControl): Observable<any> {
    //     return this._authenticationService.verifyEmail(control.value).pipe(map((response: any) => {
    //         if (response === null || response?.data === null
    //             || response?.data === undefined
    //             || response?.successFlag !== true
    //             || response?.data === true) {
    //             throw 'Error';
    //         } else {
    //             return null;
    //         }
    //     }), catchError(err => {
    //         return of({'theEmailAlreadyExists': true});
    //     }));
    // }

    validateEmail(_authenticationService): AsyncValidatorFn {
        let s = (control) => control.valueChanges.pipe(
            debounceTime(600),
            distinctUntilChanged(), switchMap((val: string) => {
                return _authenticationService
                    .verifyEmail(val)
                    .pipe()
            }),
            map((value: any) => {
                console.log(value);
                return value === null || value?.data === null
                || value?.data === undefined
                || value?.successFlag !== true
                || value?.data === true ?
                    {'emailExists': true} : null;
            }),
            catchError(err => {
                console.error(err);
                return of({'emailExists': true})
            }),
            first()
        );
        console.log(s);
        return s;
    }

    /**
     * Toggle password
     */
    togglePasswordTextType() {
        this.passwordTextType = !this.passwordTextType;
    }

    validateControl(control: AbstractControl) {
        return validateControl(control)
    }

    validate(form, controlName) {
        return validate(form, controlName)
    }

    /**
     * On Submit
     */
    onSubmit() {
        console.log(this.registerForm, this.registerForm.value);
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        if (this.f.password.value != this.f.cPassword.value) {
            this._toastrService.error('Password or Confirm password not match.', 'Password not match.');
            return;
        }

        this.cardBlockUI.start();
        this.submitted = true;
        var regObj =this.registerForm.value;
        var email = this._encryptionService.encryptData(regObj.email);
        var pwd = this._encryptionService.encryptData(regObj.password);
        var cPwd = this._encryptionService.encryptData(regObj.cPassword);

        var postData = {firstName:regObj.firstName,middleName:regObj.middleName,
            lastName:regObj.lastName,phoneNo:regObj.phoneNo,email:email,password:pwd,cPassword:cPwd}
        this._authenticationService.register(postData).subscribe(
            (res: any) => {
                if (res) {
                    this.cardBlockUI.stop()

                    // localStorage.setItem('token', res.Data.AuthToken);
                    // this._router.navigate([this.returnUrl]);
                }
            },
            err => {
                this.cardBlockUI.stop()
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
        // this.registerForm = this._formBuilder.group({
        //     firstName: ['', [Validators.required]],
        //     lastName: ['', [Validators.required]],
        //     phoneNo: ['', [Validators.required]],
        //     email: ['', [Validators.required, Validators.email]],
        //     password: ['', [Validators.required, Validators.minLength(8), PasswordStrengthValidator]],
        //     cPassword: ['', [Validators.required, Validators.minLength(8), PasswordStrengthValidator]]
        // });

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
