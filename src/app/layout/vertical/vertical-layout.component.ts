import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {CoreConfigService} from '@core/services/config.service';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {User} from "../../auth/models";

@Component({
    selector: 'vertical-layout',
    templateUrl: './vertical-layout.component.html',
    styleUrls: ['./vertical-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerticalLayoutComponent implements OnInit, OnDestroy {
    coreConfig: any;
    // -----------------------------------------------------------------------------------------------------
    hasTopMenu: boolean = false;
    // Lifecycle Hooks
    currentUser: User;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     * @param _elementRef
     * @param _authenticationService
     * @param _changeDetector
     */
    constructor(private _coreConfigService: CoreConfigService,
                private _elementRef: ElementRef,
                private _authenticationService: AuthenticationService,
                private _changeDetector: ChangeDetectorRef) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = _authenticationService.currentUserValue;
        _authenticationService.currentUser.subscribe(value => {
            this.currentUser = value;
        });
        setTimeout(() => {
            _changeDetector.detectChanges();
        }, 2000)
        console.log(this.currentUser);
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
        (this._coreConfigService.hasTopMenu as Observable<boolean>).pipe(takeUntil(this._unsubscribeAll)).subscribe(value => {
            this.hasTopMenu = value;
        })
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
