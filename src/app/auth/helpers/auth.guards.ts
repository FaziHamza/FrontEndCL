import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserAuthService} from '../service/user-auth.service';
import {AuthenticationService} from "../../shared/services/authentication.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    /**
     *
     * @param {Router} _router
     * @param {UserAuthService} _authenticationService
     */
    constructor(private _router: Router, private _authenticationService: AuthenticationService) {
    }

    // canActivate
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // debugger
        // return true;
        const currentUser = this._authenticationService.currentUserValue;

        if (currentUser) {
            // check if route is restricted by role
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
                // role not authorised so redirect to not-authorized page
                this._router.navigate(['/pages/miscellaneous/not-authorized']);
                return false;
            }

            if (!currentUser.isEmailVerified) {
                this._router.navigate(['/authentication/verify']);
                return false;
            }

            if (!currentUser.isInitialSetupDone) {
                this._router.navigate(['/user/initial-setup']);
            }

            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this._router.navigate(['/authentication/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
