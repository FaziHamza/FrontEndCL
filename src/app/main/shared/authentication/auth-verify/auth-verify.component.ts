import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {CoreConfigService} from "../../../../../@core/services/config.service";
import {first, takeUntil} from "rxjs/operators";
import {AuthenticationService} from "../../../../auth/service";

@Component({
    selector: 'app-auth-verify',
    templateUrl: './auth-verify.component.html',
    styleUrls: ['./auth-verify.component.scss']
})
export class AuthVerifyComponent implements OnInit {
    // Public
    public emailVar = "some-email@place.com";
    public coreConfig: any;
    public authVerifyForm: FormGroup;
    public submitted = false;
    // -----------------------------------------------------------------------------------------------------
    changeEmailCollapse: boolean = true;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     * @param {FormBuilder} _formBuilder
     *
     * @param _authenticationService
     */
    constructor(private _coreConfigService: CoreConfigService, private _formBuilder: FormBuilder, private _authenticationService: AuthenticationService,
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
        var currentUserValue = _authenticationService.currentUserValue;
        this.emailVar = currentUserValue.email;
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.authVerifyForm.controls;
    }

    // Lifecycle Hooks

    /**
     * On Submit
     */
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.authVerifyForm.invalid) {
            return;
        }

    }
    resendEmail(){
        var resendEmail =this.emailVar ;
        this._authenticationService
        .resendEmail(resendEmail)
        .pipe(first())
        .subscribe(
            data => {
                if(data.successFlag){
                    
                }
                
            },
            error => {
            
            }
        );
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.authVerifyForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
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

    logout() {
        this._authenticationService.logout();
    }
}
