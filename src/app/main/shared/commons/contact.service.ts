import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {ToastrService} from 'ngx-toastr';
import {map} from 'rxjs/operators';
import {Router} from "@angular/router";
import {BehaviorSubject} from 'rxjs';
import {User} from 'app/auth/models';
import {ContactPost, getContactDto} from 'app/shared/contracts.model';


@Injectable({
    providedIn: 'root'
})
export class ContactService {

    rootUrl: string = environment.serverApiUrl;
    getContactList: getContactDto[] = [];
    saveContact: ContactPost;
    totalCount: number;
    private currentUserSubject: BehaviorSubject<User>;

    constructor(private _http: HttpClient, private _toastrService: ToastrService, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        // this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    getContact(page: number, pageSize: number, search: string, type: boolean) {
        // debugger
        const userInfo = localStorage.getItem('currentUser');
        const jsonData = JSON.parse(userInfo);
        const modal = {
            Page: page,
            Pagesize: pageSize,
            Search: search,
            Internal: type,
            OrginzationId: jsonData.organizationId
        };
        return this._http
            .post<any>(this.rootUrl + '/api/Contact/Get', modal)
            .pipe(
                map(contactData => {
                    if (contactData && contactData.successFlag) {
                        // debugger
                        if (contactData.totalCount == 0) {
                            this.getContactList = [];
                            this._toastrService.error(
                                contactData.message +
                                ' Please try again ',
                                'no found',
                                {toastClass: 'toast ngx-toastr', closeButton: true}
                            );
                        } else
                            this.totalCount = contactData.totalCount;
                        return contactData;
                    } else {
                        setTimeout(() => {
                            this._toastrService.error(
                                contactData.message +
                                ' Please try again ',
                                'Failed',
                                {toastClass: 'toast ngx-toastr', closeButton: true}
                            );
                        }, 2500);
                    }

                })
            );
    }

    saveContactData(modal: ContactPost, hasOrgId = false) {
        const userInfo = localStorage.getItem('currentUser');
        const jsonData = JSON.parse(userInfo);
        modal.organizationId = jsonData.organizationId;

        return this._http
            .post<any>(this.rootUrl + '/api/Contact/Add', modal)
            .pipe(
                map(contactData => {
                    if (contactData && contactData.successFlag) {
                        this._toastrService.success(
                            contactData.message +
                            'Contract Successfully Save! ',
                            '',
                            {toastClass: 'toast ngx-toastr', closeButton: true}
                        );
                        return contactData;
                    } else {
                        setTimeout(() => {
                            this._toastrService.error(
                                contactData.message +
                                ' Please try again ',
                                'Failed',
                                {toastClass: 'toast ngx-toastr', closeButton: true}
                            );
                        }, 2500);
                        this.getContactList = [];
                    }

                })
            );
    }

    deleteContact(id: number) {

        return this._http
            .post<any>(this.rootUrl + '/api/Contact/delete?id', id)
            .pipe(
                map(contactData => {
                    if (contactData && contactData.SuccessFlag) {
                        this._toastrService.success(
                            contactData.message +
                            contactData.message,
                            '',
                            {toastClass: 'toast ngx-toastr', closeButton: true}
                        );
                        return contactData;
                    } else {
                        setTimeout(() => {
                            this._toastrService.error(
                                contactData.message +
                                ' Please try again ',
                                'Failed',
                                {toastClass: 'toast ngx-toastr', closeButton: true}
                            );
                        }, 2500);
                    }

                })
            );
    }
}
