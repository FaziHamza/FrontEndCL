import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {validate, validateControl} from 'app/shared/models/helpers';

@Component({
    selector: 'app-reference',
    templateUrl: './reference.component.html',
    styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {

    public contentHeader: object
    public firstName = '';
    referenceTypes = [
        {id: 1, name: 'Personal'},
        {id: 2, name: 'Official'}];
    language = '';
    dateOfBirth: any;
    genders = [{name: 'BS'}, {name: 'MS'}];
    gender: any = '';
    referenceForm = this.fb.group({
        id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        imgUrl: '',
        referenceType: '',
        referenceTypeId: '',
        email: ''
    });

    @Output('onSubmitReferenceForm') onSubmitReferenceForm: EventEmitter<{ form: FormGroup, }> = new EventEmitter<{ form: FormGroup }>();
    @Input('referenceData') referenceData;
    textFieldMaxLength: number = 15;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.onSubmitReferenceForm.emit({form: this.referenceForm});
        console.log(this.referenceData);
        if (this.referenceData !== undefined && this.referenceData !== null) {
            Object.keys(this.referenceData).forEach(name => {
                if (this.referenceForm.controls[name]) {
                    this.referenceForm.controls[name].patchValue(this.referenceData[name], {onlySelf: true});
                }
            });
        }
    }

    //TODO: Remove this. It seems to be redundant now.
    validationText(controlName) {
        let validation = ''
        for (const controlNameKey in this.referenceForm.controls[controlName].errors) {
            switch (controlNameKey) {
                case "required":
                    validation = this.append(validation, `<span>This Field is Required!</span>`);
                    break;
                case "maxlength":
                    validation = this.append(validation, `<span>Max Length Exceeds!</span>`)
                    break;
                default:
                    break;
            }
        }
        return validation;
    }

    validateControl(control: AbstractControl) {
        return validateControl(control)
    }

    validate(form, controlName) {
        return validate(form, controlName)
    }

    private append(base: string, toAppend: string): string {
        if (base.length > 8) {
            base += '<br>'
        }
        base += toAppend;
        return base;
    }

    onReferenceFormSubmit() {
        this.onSubmitReferenceForm.emit({form: this.referenceForm});
    }
}
