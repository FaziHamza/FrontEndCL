import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import 'hammerjs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {ToastrModule} from 'ngx-toastr'; // For auth after login toast
import {CoreModule} from '@core/core.module';
import {CoreCommonModule} from '@core/common.module';
import {CoreSidebarModule, CoreThemeCustomizerModule} from '@core/components';

import {coreConfig} from 'app/app-config';

import {AppComponent} from 'app/app.component';
import {LayoutModule} from 'app/layout/layout.module';
import {SampleModule} from 'app/main/sample/sample.module';
import {AuthenticationModule} from "./main/shared/authentication/authentication.module";
import {AuthGuard, ErrorInterceptor, JwtInterceptor} from "./auth/helpers";
import {MiscellaneousModule} from "./main/shared/miscellaneous/miscellaneous.module";
import {ContextMenuModule} from "@ctrl/ngx-rightclick";
import {PagesModule} from './main/pages/pages.module';
import {ExtensionsModule} from "./extensions/extensions.module";
import {DragulaModule} from "ng2-dragula";
import {NgxMaskModule} from "ngx-mask";
import {BlockUIModule} from "ng-block-ui";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";

const appRoutes: Routes = [
    {
        path: 'pages',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),
        canActivate: [AuthGuard]
    }, {
        path: 'timesheet',
        loadChildren: () => import('./main/shared/timesheet/timesheet.module').then(m => m.TimesheetModule),
        canActivate: [AuthGuard]
    }, {
        path: 'admin',
        loadChildren: () => import('./main/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'authentication',
        loadChildren: () => import('./main/shared/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: 'pricing',
        loadChildren: () => import('./main/shared/pricing/pricing.module').then(m => m.PricingModule)
    },
    {
        path: 'payment',
        loadChildren: () => import('./main/shared/payment/payment.module').then(m => m.PaymentModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'user',
        loadChildren: () => import('./main/user/user.module').then(m => m.UserModule),
        //canActivate: [AuthGuard]
    },
    {
        path: 'commons',
        loadChildren: () => import('./main/shared/commons/commons.module').then(m => m.CommonsModule)
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: '/miscellaneous/error' //Error 404 - Page not found
    }
];


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        // HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
        //     delay: 0,
        //     passThruUnknownUrl: true
        // }),
        RouterModule.forRoot(appRoutes, {
            scrollPositionRestoration: 'enabled', // Add options right here
            relativeLinkResolution: 'legacy'
        }),
        TranslateModule.forRoot(),
        ContextMenuModule,
        DragulaModule.forRoot(),
        NgxMaskModule.forRoot(),
        BlockUIModule.forRoot(),

        //NgBootstrap
        NgbModule,
        ToastrModule.forRoot(),
        // BlockUIModule,

        // Core modules
        CoreModule.forRoot(coreConfig),
        CoreCommonModule,
        CoreSidebarModule,
        CoreThemeCustomizerModule,

        // App modules
        LayoutModule,
        SampleModule,
        NgxDatatableModule,

        PagesModule,
        MiscellaneousModule,
        AuthenticationModule,
        ExtensionsModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

        // ! IMPORTANT: Provider used to create fake backend, comment while using real API

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
