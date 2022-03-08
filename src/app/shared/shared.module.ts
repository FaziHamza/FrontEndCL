import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {AddEditJobComponent} from './components/add-edit-job/add-edit-job.component';
import {CoreCommonModule} from "../../@core/common.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbDateParserFormatter, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {QuillModule} from "ngx-quill";
import {NarikCustomValidatorsModule} from "@narik/custom-validators";
import {AddEditContactComponent} from './components/add-edit-contact/add-edit-contact.component';
import {AbstractFormComponent} from './abstracts/abstract-form-component/abstract-form.component';
import {GeneralValidationDirective} from './directives/general-validation.directive';
import {ValidationErrorMessagesComponent} from './components/validation-error-messages/validation-error-messages.component';
import {ProfilePicPickerComponent} from './components/profile-pic-picker/profile-pic-picker.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {SearchCreateOrganizationComponent} from "./components/search-create-organization/search-create-organization.component";
import {OrganizationService} from './services/organization.service';
import { AddEditSalaryComponent } from './components/add-edit-salary/add-edit-salary.component';
import { AddEditJObLeaveComponent } from './components/add-edit-job-leave/add-edit-job-leave.component';
import { AddEditOvertimeComponent } from './components/add-edit-overtime/add-edit-overtime.component';
import { AddEditJobDayComponent } from './components/add-edit-job-day/add-edit-job-day.component';
import { NgbDateCustomParserFormatter } from './components/datepicker-popup';
import { AuthenticationService } from 'app/auth/service';
import { BlockUIModule } from 'ng-block-ui';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    declarations: [
        AddEditJobComponent,
        SearchCreateOrganizationComponent,
        AddEditContactComponent,
        AbstractFormComponent,
        GeneralValidationDirective,
        ValidationErrorMessagesComponent,
        ProfilePicPickerComponent,
        AddEditSalaryComponent,
        AddEditJObLeaveComponent,
        AddEditOvertimeComponent,
        AddEditJobDayComponent

    ],
    exports: [
        AddEditJobComponent,
        SearchCreateOrganizationComponent,
        AddEditContactComponent,
        ValidationErrorMessagesComponent,
        ProfilePicPickerComponent,
        AddEditSalaryComponent,
        AddEditJObLeaveComponent,
        AddEditOvertimeComponent,
        AddEditJobDayComponent
    ],
    imports: [
        CommonModule,
        CoreCommonModule,
        NgSelectModule,
        BsDatepickerModule.forRoot(),
        NgbModule,
        BlockUIModule,
        QuillModule.forRoot(),
        NarikCustomValidatorsModule,
        ImageCropperModule,
        // BsDatepickerModule.forRoot(),
    ],
    providers: [DatePipe,OrganizationService, {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}]
})
export class SharedModule {
}
