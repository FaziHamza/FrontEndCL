import {Component, HostBinding, HostListener, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';

import * as _ from 'lodash';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

import {AuthenticationService} from 'app/auth/service';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {CoreConfigService} from '@core/services/config.service';
import {CoreMediaService} from '@core/services/media.service';

import {User} from 'app/auth/models';

import {coreConfig} from 'app/app-config';
import {Router} from '@angular/router';
import {CoreMenuItem} from "../../../../@core/types";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, OnDestroy {
    public horizontalMenu: boolean;
    public hiddenMenu: boolean;

    public coreConfig: any;
    public currentSkin: string;
    public prevSkin: string;

    public currentUser: User;
    userName: string

    public topRightHeaderMenuItems: CoreMenuItem[] = [];

    public languageOptions: any;
    public navigation: any;
    public selectedLanguage: any;

    @HostBinding('class.fixed-top')
    public isFixed = false;

    @HostBinding('class.navbar-static-style-on-scroll')
    public windowScrolled = false;
    // -----------------------------------------------------------------------------------------------------
    menuDDOpened: boolean = false;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {Router} _router
     * @param {AuthenticationService} _authenticationService
     * @param {CoreConfigService} _coreConfigService
     * @param {CoreSidebarService} _coreSidebarService
     * @param {CoreMediaService} _coreMediaService
     * @param {MediaObserver} _mediaObserver
     * @param {TranslateService} _translateService
     */
    constructor(
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private _coreConfigService: CoreConfigService,
        private _coreMediaService: CoreMediaService,
        private _coreSidebarService: CoreSidebarService,
        private _mediaObserver: MediaObserver,
        public _translateService: TranslateService
    ) {
        this.coreConfig = coreConfig;
        this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));

        this.languageOptions = {
            en: {
                title: 'English',
                flag: 'us'
            },
            fr: {
                title: 'French',
                flag: 'fr'
            },
            de: {
                title: 'German',
                flag: 'de'
            },
            pt: {
                title: 'Portuguese',
                flag: 'pt'
            }
        };


        // Add Timesheet
        // Daily Activity
        // Hourly Activity
        // Timsheet History
        // Invite Manager/Approver
        // Invite Vendor


        // Add Timesheet
        // Invoice History


        // Groups List


        // Contacts List


        this.topRightHeaderMenuItems.push({id: '1', title: 'Organization', type: "item", icon: ''});
        this.topRightHeaderMenuItems.push({id: '2', title: 'Job', type: "item", icon: ''});
        this.topRightHeaderMenuItems.push({id: '3', title: 'Employee', type: "item", icon: ''});
        this.topRightHeaderMenuItems.push({
            id: '4',
            title: 'Add Group',
            type: "item",
            icon: '',
            url: '/commons/groups'
        });
        this.topRightHeaderMenuItems.push({
            id: '5',
            title: 'Contacts',
            type: "item",
            icon: '',
            url: '/commons/contacts'
        });
        this.topRightHeaderMenuItems.push({
            id: '5',
            title: 'contact Test',
            type: "item",
            icon: '',
            url: '/commons/contactsTest'
        });
        this.topRightHeaderMenuItems.push({id: '6', title: 'Payment Method', type: "item", icon: ''});
        this.topRightHeaderMenuItems.push({id: '7', title: 'Calendar', type: "item", icon: ''});
        this.topRightHeaderMenuItems.push({id: '8', title: 'Set Employee Permission', type: "item", icon: ''});
        this.topRightHeaderMenuItems.push({id: '9', title: 'Subscription', type: "item", icon: ''});
        this.topRightHeaderMenuItems.push({id: '10', title: 'User Package Items', type: "item", icon: ''});
        this.topRightHeaderMenuItems.push({
            id: '11',
            title: 'Quick Setup Wizard',
            url: '/user/initial-setup',
            type: "item",
            icon: ''
        });

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    // Add .navbar-static-style-on-scroll on scroll using HostListener & HostBinding
    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (
            (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) &&
            this.coreConfig.layout.navbar.type == 'navbar-static-top' &&
            this.coreConfig.layout.type == 'horizontal'
        ) {
            this.windowScrolled = true;
        } else if (
            (this.windowScrolled && window.pageYOffset) ||
            document.documentElement.scrollTop ||
            document.body.scrollTop < 10
        ) {
            this.windowScrolled = false;
        }
    }

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebar(key): void {
        this._coreSidebarService.getSidebarRegistry(key).toggleOpen();
    }

    /**
     * Set the language
     *
     * @param language
     */
    setLanguage(language): void {
        // Set the selected language for the navbar on change
        this.selectedLanguage = language;

        // Use the selected language id for translations
        this._translateService.use(language);

        this._coreConfigService.setConfig({app: {appLanguage: language}}, {emitEvent: true});
    }

    /**
     * Toggle Dark Skin
     */
    toggleDarkSkin() {
        // Get the current skin
        this._coreConfigService
            .getConfig()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(config => {
                this.currentSkin = config.layout.skin;
            });

        // Toggle Dark skin with prevSkin skin
        this.prevSkin = localStorage.getItem('prevSkin');

        if (this.currentSkin === 'dark') {
            this._coreConfigService.setConfig(
                {layout: {skin: this.prevSkin ? this.prevSkin : 'default'}},
                {emitEvent: true}
            );
        } else {
            localStorage.setItem('prevSkin', this.currentSkin);
            this._coreConfigService.setConfig({layout: {skin: 'dark'}}, {emitEvent: true});
        }
    }

    // Lifecycle Hooks

    /**
     * Logout method
     */
    logout() {
        this._authenticationService.logout().subscribe(
            (res: any) => {
                // if (res && res.data !== null) {
                //     localStorage.setItem('token', res.data.authToken);
                //     this._router.navigate(['/']);
                // } else {
                //     this.formBlockUI.stop();
                //     this._toastrService.error(res?.message || 'Please Try Again. An Unknown Error Occurred!', 'Authentication failed.');
                // }
                this._router.navigate(['/authentication/login']);
                window.location.reload();

            },
            err => {
                // this.formBlockUI.stop();
                // if (err.status == 400) {
                //     console.log("Incorrect");
                //     this._toastrService.error("Unknown Server Side Error Occurred! Check your Internet or Contact Support!");
                // } else
                    console.log(err);
            }
        );
    }
    // }

    /**
     * On init
     */
    ngOnInit(): void {
        // get the currentUser details from localStorage
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Subscribe to the config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
            this.horizontalMenu = config.layout.type === 'horizontal';
            this.hiddenMenu = config.layout.menu.hidden === true;
            this.currentSkin = config.layout.skin;

            // Fix: for vertical layout if default navbar fixed-top than set isFixed = true
            if (this.coreConfig.layout.type === 'vertical') {
                setTimeout(() => {
                    if (this.coreConfig.layout.navbar.type === 'fixed-top') {
                        this.isFixed = true;
                    }
                }, 0);
            }
        });

        // Horizontal Layout Only: Add class fixed-top to navbar below large screen
        if (this.coreConfig.layout.type == 'horizontal') {
            // On every media(screen) change
            this._coreMediaService.onMediaUpdate.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                const isFixedTop = this._mediaObserver.isActive('bs-gt-xl');
                if (isFixedTop) {
                    this.isFixed = false;
                } else {
                    this.isFixed = true;
                }
            });
        }

        // Set the selected language from default languageOptions
        this.selectedLanguage = _.find(this.languageOptions, {
            id: this._translateService.currentLang
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
