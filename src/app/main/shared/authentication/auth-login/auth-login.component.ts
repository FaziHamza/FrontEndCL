import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {CoreConfigService} from '@core/services/config.service';
import {AuthenticationService} from "../../../../auth/service";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {ToastrService} from "ngx-toastr";
import { EncryptionService } from 'app/shared/services/encryption.service';

@Component({
    selector: 'app-auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthLoginComponent implements OnInit {
    //  Public
    public coreConfig: any;
    public loginForm: FormGroup;
    public loading = false;
    public submitted = false;
    public returnUrl: string;
    public error = '';
    public passwordTextType: boolean;
    @BlockUI('form-section') formBlockUI: NgBlockUI;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     * @param _formBuilder
     * @param _route
     * @param _toastrService
     * @param _router
     * @param _authenticationService
     */
    constructor(
        private _coreConfigService: CoreConfigService,
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
        private _router: Router,
        private _authenticationService: AuthenticationService,
        public _encryptionService :EncryptionService
    ) {
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
        return this.loginForm.controls;
    }

    /**
     * Toggle password
     */
    togglePasswordTextType() {
        this.passwordTextType = !this.passwordTextType;
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }

        let urlParams = new URLSearchParams(window.location.search);
        // console.log(urlParams.has('code'))
        let code = urlParams.get('code');

        if (!urlParams.has('code')) {
            this.formBlockUI.start("Logging In...");
            this.login(this.f.email.value, this.f.password.value);
        } else
            this.loginByCode(this.f.email.value, this.f.password.value, code);
    }

    login(email, password) {
        // debugger
        this._authenticationService.login({email: this._encryptionService.encryptData(email), password: this._encryptionService.encryptData(password)}).subscribe(
            (res: any) => {
                if (res && res.data !== null) {
                    // localStorage.setItem('token', res.data.authToken);
                    this._router.navigate(['/']);
                } else {
                    this.formBlockUI.stop();
                    this._toastrService.error(res?.message || 'Please Try Again. An Unknown Error Occurred!', 'Authentication failed.');
                }
            },
            err => {
                this.formBlockUI.stop();
                if (err.status == 400) {
                    console.log("Incorrect");
                    this._toastrService.error("Unknown Server Side Error Occurred! Check your Internet or Contact Support!");
                } else
                    console.log(err);
            }
        );
    }

    loginByCode(email, password, code) {
        this._authenticationService.loginByCode(email, password, code).subscribe(
            (res: any) => {
                if (res) {
                    this._router.navigate(["/authentication/reset-password"]);
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

    onSubmit1() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        // Login
        this.loading = true;
        this._authenticationService
            .login({email: this.f.email.value, password: this.f.password.value})
            .pipe(first())
            .subscribe(
                data => {
                    this._router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                }
            );
        // setTimeout(() => {
        // }, 100);
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required]],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

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
