import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {CoreCommonModule} from '@core/common.module';

import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';

import {SampleComponent} from './sample.component';
import {HomeComponent} from './home.component';
import {AuthGuard} from "../../auth/helpers";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CoreCardModule} from "../../../@core/components/core-card/core-card.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TopMenuModule} from "../../layout/components/top-menu/top-menu.module";
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { BlockUIModule } from 'ng-block-ui';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const routes = [
    {
        path: 'sample',
        component: SampleComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'home',
        component: HomeComponent,
        data: {animation: 'home'},
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [SampleComponent, HomeComponent],
    imports: [RouterModule.forChild(routes),
        NgSelectModule,
        ContentHeaderModule,
        TranslateModule,
        CoreCommonModule,
        CoreCardModule,
        TopMenuModule,
        SharedModule,
        NgbModule,BlockUIModule,BsDatepickerModule.forRoot(),],
    exports: [SampleComponent, HomeComponent]
})
export class SampleModule {
}
