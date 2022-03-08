import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';

import {CoreCommonModule} from '@core/common.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {PricingModule} from "../shared/pricing/pricing.module";
import {GeneralPageTemplateComponent} from './general-page-template/general-page-template.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../auth/helpers";
import {CardSnippetModule} from "../../../@core/components/card-snippet/card-snippet.module";
import {InvoiceSampleComponent} from './invoice-sample/invoice-sample.component';
import {ContextMenuModule} from "@ctrl/ngx-rightclick";
import {ContactContextMenuComponent} from "../user/profile/user-info/contact-context-menu/contact-context-menu.component";
import {MeetingRoomsComponent} from './meeting-rooms/meeting-rooms.component';
import {OrganizationComponent} from './organization/organization.component';
import {JobComponent} from './job/job.component';
import {PositionComponent} from './position/position.component';
import {InvoiceComponent} from './invoice/invoice.component';
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {NarikCustomValidatorsModule} from "@narik/custom-validators";
import {SharedModule} from "../../shared/shared.module";
import {BlockUIModule} from "ng-block-ui";
import { OrgConfigurationComponent } from './org-configuration/org-configuration.component';
import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';
import { TaskStatusComponent } from './task-status/task-status.component';
import { SkillComponent } from './skill/skill.component';
import { SkillCategoryComponent } from './skill-category/skill-category.component';


const routes = [
    {
        path: 'gp-templates',
        component: GeneralPageTemplateComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    }, {
        path: 'invoice-sample',
        component: InvoiceSampleComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'org',
        component: OrganizationComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'position',
        component: PositionComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'job',
        component: JobComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
   {
        path: 'org-config',
        component: OrgConfigurationComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'meeting-room',
        component: MeetingRoomsComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'invoice',
        component: InvoiceComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'projects',
        component: ProjectComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'task',
        component: TaskComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'taskstatus',
        component: TaskStatusComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'skill',
        component: SkillComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
    {
        path: 'skillcatg',
        component: SkillCategoryComponent,
        data: {animation: 'sample'},
        canActivate: [AuthGuard]
    },
];

@NgModule({
    declarations: [
        GeneralPageTemplateComponent,
        InvoiceSampleComponent,
        ContactContextMenuComponent,
        MeetingRoomsComponent,
        OrganizationComponent,
        JobComponent,
        OrgConfigurationComponent,
        PositionComponent,
        InvoiceComponent,
        ProjectComponent,
        TaskComponent,
        TaskStatusComponent,
        SkillComponent,
        SkillCategoryComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        ContentHeaderModule,
        NgbModule,
        RouterModule.forChild(routes),
        NgSelectModule,
        FormsModule,
        CardSnippetModule,
        ContextMenuModule,
        Ng2FlatpickrModule,
        NarikCustomValidatorsModule,
        SharedModule,
        BlockUIModule
    ],

    providers: []
})
export class PagesModule {
}
