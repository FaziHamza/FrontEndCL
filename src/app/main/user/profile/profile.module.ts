import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from './profile.component';
import {ProfileDashboardComponent} from "./profile-dashboard/profile-dashboard.component";
import {EducationComponent} from "./education/education.component";
import {ReferenceComponent} from "./reference/reference.component";
import {SkillComponent} from "./skill/skill.component";
import {UserInfoComponent} from "./user-info/user-info.component";
import {WorkExperienceComponent} from "./work-experience/work-experience.component";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CoreCommonModule} from "../../../../@core/common.module";
import {TopMenuModule} from "../../../layout/components/top-menu/top-menu.module";
import {SharedModule} from "../../../shared/shared.module";
import {NarikCustomValidatorsModule} from "@narik/custom-validators";


@NgModule({
    declarations: [
        ProfileComponent,
        ProfileDashboardComponent,
        EducationComponent,
        ReferenceComponent,
        SkillComponent,
        UserInfoComponent,
        WorkExperienceComponent
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FormsModule,
        NgSelectModule,
        NgbModule,
        CoreCommonModule,
        TopMenuModule,
        SharedModule,
        NarikCustomValidatorsModule
    ]
})
export class ProfileModule {
}
