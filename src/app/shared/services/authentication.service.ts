import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "environments/environment";
import { Role, User } from "app/auth/models";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { APIResponse } from "../models/a-p-i-Response";
import { Organization } from "../models/organization";
import { debug } from "console";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;
  public  tempOrgId:number=0
  // public currentOrganization: Observable<Organization>;
  public organizationSubject: BehaviorSubject<Organization>;
  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   * @param router
   */
  constructor(
    private _http: HttpClient,
    private _toastrService: ToastrService,
    private router: Router,
   
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.organizationSubject = new BehaviorSubject<Organization>(null);
  }
  get headers() {
    return {
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9',
        Authorization: `Bearer ${this.currentUserValue.authToken}`,
        OrganizationId: `${this.currentOrganizationValue?.organizationId || this.currentUserValue.organizationId}`
    };
}
  

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentOrganizationValue(): Organization {
    return this.organizationSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return (
      this.currentUser && this.currentUserSubject.value.role === Role.Admin
    );
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return (
      this.currentUser && this.currentUserSubject.value.role === Role.Client
    );
  }

  /**
   * User login
   *
   * @returns user
   * @param userLogin { email: string; password: string; }
   */

  login(userLogin: { email: string; password: string }) {
    
    return this._http
      .post<any>(environment.serverApiUrl + "/api/Account/Login", userLogin)
      .pipe(
        map((user) => {
          console.log(user);
          // login successful if there's a jwt token in the response
          if (
            user !== undefined &&
            user !== null &&
            user.successFlag === true
          ) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user.data));
            localStorage.setItem('token', user.data.authToken);
            // Display welcome toast!
            // setTimeout(() => {
            this._toastrService.success(
              "You have successfully logged to" +
                "  ClCong. Now you can start to explore. Enjoy! 🎉",
              "👋 Welcome, " + user.data.email + "!",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
            

            // }, 2500);

            // notify
            this.currentUserSubject.next(user.data);
            

            return user;
          } else {
            this._toastrService.error(
              user.message + " Please try again ",
              "Faild",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
          }
          return user;
        }),
        catchError((err) => {
          if (environment.logErrors) console.log(err);

          return of({});
        })
      );
  }

  getUserDetails() {
    let headers = {
      Authorization: `Bearer ${this.currentUserValue.authToken}`,
    };
    return this._http
      .get<APIResponse<User>>(
        environment.serverApiUrl + "/api/Account/GetUserDetails",
        { headers: headers }
      )
      .pipe(
        map((res) => {
          if (environment.showLogs) console.log(res);
          if (res.successFlag) {
            let nD = res.data;
            nD.authToken = localStorage.getItem("token");
            localStorage.setItem("currentUser", JSON.stringify(nD));
            this.currentUserSubject.next(nD);
          }
        })
      );
  }

  resetPassword(userName: string, password: string, code: string) {
    var modal = {
      UserName: JSON.parse(userName),
      Password: password,
      code: JSON.parse(code),
    };
    return this._http
      .post<any>(environment.serverApiUrl + "/api/account/resetpassword", modal)
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          if (user && user.successFlag) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user.data));
            // Display welcome toast!
            // setTimeout(() => {
            this._toastrService.success(
              user.message + "  ClCong. Now you can start login. Enjoy! 🎉",
              "👋" + +"!",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
            this.router.navigate(["/"]);

            // }, 2500);

            // notify
            this.currentUserSubject.next(user.data);

            return user;
          } else {
            setTimeout(() => {
              this._toastrService.error(
                user.message + " Please try again ",
                "Faild",
                { toastClass: "toast ngx-toastr", closeButton: true }
              );
            }, 2500);
          }
        })
      );
  }

  resendEmail(email: string) {
    var modal = {
      Email: email,
    };
    // 
    return this._http
      .post<any>(environment.serverApiUrl + "/api/account/ResendEmail", modal)
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          if (user && user.successFlag) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes

            // Display welcome toast!
            // setTimeout(() => {
            this._toastrService.success(user.message + "", "👋" + "!", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });

            // }, 2500);

            // notify
            this.currentUserSubject.next(user.data);

            return user;
          } else {
            setTimeout(() => {
              this._toastrService.error(
                user.message + " Please try again ",
                "Faild",
                { toastClass: "toast ngx-toastr", closeButton: true }
              );
            }, 2500);
          }
        })
      );
  }

  loginByCode(email: string, password: string, code: string) {
    // 
    var modal = {
      Email: email,
      Password: password,
      code: code,
    };
    return this._http
      .post<any>(environment.serverApiUrl + "/api/account/LoginByCode", modal)
      .pipe(
        map((user) => {
          // 
          // login successful if there's a jwt token in the response
          if (user && user.successFlag) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("code", JSON.stringify(code));
            localStorage.setItem("userName", JSON.stringify(email));
            // Display welcome toast!
            // setTimeout(() => {
            this._toastrService.success(
              user.message +
                "  ClCong. Now you can start to explore. Enjoy! 🎉",
              "👋 Welcome, " + user.message + "!",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
            this.router.navigate(["/authentication/reset-password"]);
            return user;
          } else {
            setTimeout(() => {
              this._toastrService.error(
                user.message + " Please try again ",
                "Faild",
                { toastClass: "toast ngx-toastr", closeButton: true }
              );
            }, 2500);
          }
        })
      );
  }

  IsVerify(code: string, email: string) {
    const modal = {
      email: email,
      code: code,
    };
    return this._http
      .post<any>(environment.serverApiUrl + "/api/account/ConfirmEmail", modal)
      .pipe(
        map((user) => {
          // 
          // login successful if there's a jwt token in the response
          if (user && user.successFlag) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // Display welcome toast!
            // setTimeout(() => {
            this._toastrService.success(
              user.message + "  ClCong. Now you can set reset password! 🎉",
              "",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
            //this.router.navigate(["/authentication/login"]);

            // }, 2500);

            // notify
            // this.currentUserSubject.next(user);

            return user;
          } else {
            setTimeout(() => {
              this._toastrService.error(
                user.message + " Please try again ",
                "Faild",
                { toastClass: "toast ngx-toastr", closeButton: true }
              );
            }, 2500);
          }
        })
      );
  }

  forget(email: string) {
    var modal = {
      Email: email,
    };
    return this._http
      .post<any>(
        environment.serverApiUrl + "/api/Account/ForgotPassword",
        modal
      )
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          if (user && user.successFlag) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('currentUser', JSON.stringify(user));
            // Display welcome toast!
            // setTimeout(() => {
            this._toastrService.success(
              "You have successfully done " + user.message,
              "",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );

            // }, 2500);

            // notify
            // this.currentUserSubject.next(user);

            return user;
          } else {
            this._toastrService.error(
              user.message + " Please try again ",
              "Faild",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
          }
        })
      );
  }

  register(modal) {
    
    return this._http
      .post<any>(environment.serverApiUrl + "/api/account/register", modal,)
      .pipe(
        map((user) => {
          console.log(user);
          // login successful if there's a jwt token in the response
          if (user && user.successFlag) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
            // Display welcome toast!
            // setTimeout(() => {
            this._toastrService.success(
              user.message +
                "  ClCong. Now you can start to explore. Enjoy! 🎉",
              "👋 Please verify you account at , " + user.data.email + "!",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
            // }, 2500);
          } else {
            // setTimeout(() => {
            this._toastrService.error(
              user.message + " Please try again ",
              "Faild",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
            // }, 2500);
          }
          return user;
        })
      );
  }

  /**
   * User logout
   *
   */
  logout(onDone = null) {
    const modal = {
      email: "",
      code: "",
    };
    // remove user from local storage to log user out.
    return this._http
      .post<any>(environment.serverApiUrl + "/api/account/LogOut", modal,{ headers: this.headers })
      .pipe(
        map((user) => {
          console.log(user);
          // login successful if there's a jwt token in the response
          if (user.successFlag) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.removeItem("currentUser");
            localStorage.removeItem("token");
            localStorage.removeItem("currentOrgaization");
            localStorage.removeItem("allOrgaizations");


            // notify
            this.currentUserSubject.next(null);
            if (onDone !== null) {
              onDone();
            }
            // }, 2500);
          } else {
            // setTimeout(() => {
            this._toastrService.error(
              user.message + " Please try again ",
              "Faild",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );
            // }, 2500);
          }
          return user;
        })
      );
  }

  verifyEmail(email: string): Observable<any> {
    return this._http.get(
      environment.serverApiUrl +
        "/api/Account/VerifyEmailExists?key=ab123344s2b6b5s5s1s&email=" +
        email
    );
  }
}
