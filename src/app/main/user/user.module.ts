import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileModule} from "./profile/profile.module";
import {EmployeeContractorWizardComponent} from "./employee-contrator-wizard/employee-contractor-wizard.component";
import {UserRoutingModule} from "./user-routing.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";
import {TranslateModule} from "@ngx-translate/core";
import {CoreCommonModule} from "../../../@core/common.module";
import {CoreCardModule} from "../../../@core/components/core-card/core-card.module";
import {TopMenuModule} from "../../layout/components/top-menu/top-menu.module";
import {SharedModule} from "../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BlockUIModule} from "ng-block-ui";

@NgModule({
    declarations: [EmployeeContractorWizardComponent],
    imports: [
        ProfileModule,
        UserRoutingModule,
        CommonModule,
        NgSelectModule,
        ContentHeaderModule,
        TranslateModule,
        CoreCommonModule,
        CoreCardModule,
        TopMenuModule,
        SharedModule,
        NgbModule,
        BlockUIModule
    ]
})
export class UserModule {
}
