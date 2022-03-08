import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {LookupsComponent} from './lookups/lookups.component';
import {CardSnippetModule} from "../../../@core/components/card-snippet/card-snippet.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {CoreCommonModule} from "../../../@core/common.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";
import {BlockUIModule} from "ng-block-ui";

@NgModule({
    declarations: [
        LookupsComponent
    ],
    imports: [
        CommonModule, NgxDatatableModule,
        AdminRoutingModule,
        CardSnippetModule,
        CoreCommonModule,
        NgbModule, ContentHeaderModule, BlockUIModule,
    ]
})
export class AdminModule {
}
