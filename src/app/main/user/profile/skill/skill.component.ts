import {Component, OnInit} from '@angular/core';
import {AbstractFormComponent} from "../../../../shared/abstracts/abstract-form-component/abstract-form.component";
import {AbstractControl, FormBuilder} from "@angular/forms";
import {validate, validateControl } from 'app/shared/models/helpers';

@Component({
    selector: 'app-skill',
    templateUrl: './skill.component.html',
    styleUrls: ['./skill.component.scss']
})
export class SkillComponent extends AbstractFormComponent<any> {

    skills = [{id: 1, name: 'ASP.NET'},
        {id: 2, name: 'ASP.NET CORE'},
        {id: 3, name: 'Angular'},
        {id: 4, name: 'Angular'},
    ];


    validateControl(control: AbstractControl) {
        return validateControl(control)
    }

    validate(form, controlName) {
        return validate(form, controlName)
    }

    mainForm = this.fb.group({
        skills: '',
    });

    constructor(private fb: FormBuilder) {
        super();
    }

}
