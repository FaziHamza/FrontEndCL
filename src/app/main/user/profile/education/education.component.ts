import {Component, OnInit} from '@angular/core';
import {AbstractFormComponent} from "../../../../shared/abstracts/abstract-form-component/abstract-form.component";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {validateControl, validate} from "../../../../shared/models/helpers";

@Component({
    selector: 'app-education',
    templateUrl: './education.component.html',
    styleUrls: ['./education.component.scss']
})
export class EducationComponent extends AbstractFormComponent<any> {
    public contentHeader: object
    public firstName = '';
    degreeTypes = [{id: 1, name: 'BS'}, {id: 2, name: 'MS'}];
    language = '';
    dateOfBirth: any;
    genders = [{name: 'BS'}, {name: 'MS'}];
    gender: any = '';
    mainForm = this.fb.group({
        id: '',
        profileId: '',
        logo: '',
        instituteName: '',
        title: '',
        degreeTypeId: '',
        gpa: '',
        maxGPA: '',
        startDate: '',
        endDate: '',
        address: this.fb.group({
            address1: '',
            address2: '',
            city: '',
            state: '',
            country: '',
            zip: ''
        }),
        addressId: '',
        detail: '',
        isCurrent: false,
        isPublic: false
    });
    specifyAddress: boolean = false;

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.onSpecifyAddressChange()
        this.onCAChange();
    }

    validateControl(control: AbstractControl) {
        return validateControl(control)
    }

    validate(form, controlName) {
        return validate(form, controlName)
    }

    getFromGroup(name: string) {
        return (this.mainForm.controls[name] as FormGroup).controls;
    }

    onSpecifyAddressChange() {
        if (this.specifyAddress) {
            this.mainForm.controls.address.enable();
        } else {
            this.mainForm.controls.address.disable();
        }
    }

    onCAChange() {
        if (this.mainForm.controls.isCurrent.value !== true) {
            this.mainForm.controls.endDate.enable();
        } else {
            this.mainForm.controls.endDate.disable();
        }
    }
}
