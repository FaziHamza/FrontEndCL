import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OrgModal} from './org.model';
import {AbstractControl, FormBuilder, FormGroup, RequiredValidator} from "@angular/forms";
import {AbstractFormComponent} from "../../../../shared/abstracts/abstract-form-component/abstract-form.component";
import {Organization} from "../../../../shared/models/organization";
import {validate, validateControl} from 'app/shared/models/helpers';

@Component({
    selector: 'app-work-experience',
    templateUrl: './work-experience.component.html',
    styleUrls: ['./work-experience.component.scss']
})
export class WorkExperienceComponent extends AbstractFormComponent<any> {
    public contentHeader: object
    public firstName = '';

    organizations: Organization[] =
        [{organizationId: 1, name: 'World Health Organization'},
            {organizationId: 2, name: 'United Nations'},
            {organizationId: 3, name: 'World Trade Organization'},
            {organizationId: 4, name: 'UNESCO'},
            {organizationId: 5, name: 'UNICEF'},
            {organizationId: -1, name: 'Custom'},
        ];

    mainForm: FormGroup = this.fb.group({
        id: '',
        organizationName: '',
        organizationId: '',
        logo: '',
        title: '',
        startDate: '',
        endDate: '',
        skills: '',
        isPublic: false
    });

    @Output('onSubmitForm') onSubmitForm: EventEmitter<{ form: FormGroup, }> = new EventEmitter<{ form: FormGroup }>();
    @Input('data') data;
    areOrganizationsLoading = false;
    skills: any[] = [{id: 1, name: 'ASP.NET'}, {id: 2, name: 'Angular'}];

    constructor(private fb: FormBuilder) {
        super();
    }

    validateControl(control: AbstractControl) {
        return validateControl(control)
    }

    validate(form, controlName) {
        return validate(form, controlName)
    }

    getErrors(fieldName: string) {
        console.log(this.mainForm.controls[fieldName].errors);
        return Object.keys(this.mainForm.controls[fieldName].errors);
    }

    getError(fieldName: string, key: string) {
        return this.mainForm.controls[fieldName].errors[key];
    }
}
