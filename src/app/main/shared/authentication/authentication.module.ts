import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {CoreCommonModule} from '@core/common.module';

import {AuthLoginComponent} from 'app/main/shared/authentication/auth-login/auth-login.component';
import {AuthRegisterComponent} from "./auth-register/auth-register.component";
import {AuthResetPasswordComponent} from "./auth-reset-password/auth-reset-password.component";
import {AuthForgotPasswordComponent} from "./auth-forgot-password/auth-forgot-password.component";
import {AuthVerifyComponent} from './auth-verify/auth-verify.component';
import {EmailconfirmationComponent} from './emailconfirmation/emailconfirmation.component';
import {SharedModule} from "../../../shared/shared.module";
import {ValidatorsModule} from "ngx-validators";
import {NarikCustomValidatorsModule} from "@narik/custom-validators";
import {BlockUIModule} from "ng-block-ui";

// routing
const routes: Routes = [
    {
        path: 'login',
        component: AuthLoginComponent,
        data: {animation: 'auth'}
    },
    {
        path: 'register',
        component: AuthRegisterComponent
    },
    {
        path: 'reset-password',
        component: AuthResetPasswordComponent
    },
    {
        path: 'forgot-password',
        component: AuthForgotPasswordComponent
    },
    {
        path: 'emailconfirmation',
        component: EmailconfirmationComponent
    },
    {
        path: 'verify',
        component: AuthVerifyComponent
    },
];

@NgModule({
    declarations: [AuthLoginComponent, AuthRegisterComponent, AuthResetPasswordComponent, AuthForgotPasswordComponent, AuthVerifyComponent, EmailconfirmationComponent],
    imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule, SharedModule, ValidatorsModule, NarikCustomValidatorsModule, BlockUIModule]
})
export class AuthenticationModule {
}
