import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CommonsRoutingModule} from './commons-routing.module';
import {CommonsComponent} from './commons.component';
import {ContactsComponent} from "./contacts/contacts.component";
import {ContextMenuModule} from "@ctrl/ngx-rightclick";
import {CoreCommonModule} from "../../../../@core/common.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ContentHeaderModule} from "../../../layout/components/content-header/content-header.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {TopMenuModule} from "../../../layout/components/top-menu/top-menu.module";
import {GroupsComponent} from "./groups/groups.component";
import {PaymentHistoryComponent} from "./payment-history/payment-history.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {SharedModule} from "../../../shared/shared.module";
import {BlockUIModule} from "ng-block-ui";
import { ContactTestComponent } from './contact-test/contact-test.component';

@NgModule({
    declarations: [
        CommonsComponent,
        ContactsComponent,
        GroupsComponent,
        PaymentHistoryComponent,
        ContactTestComponent,
    ],
    imports: [
        CommonModule,
        CommonsRoutingModule,
        ContextMenuModule,
        CoreCommonModule,
        NgbModule,
        ContentHeaderModule,
        NgSelectModule,
        TopMenuModule,
        DragDropModule,
        SharedModule,
        BlockUIModule
    ]
})
export class CommonsModule {
}
