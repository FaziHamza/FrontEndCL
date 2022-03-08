import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';

@Component({
    selector: 'error-messages',
    templateUrl: './validation-error-messages.component.html',
    styleUrls: ['./validation-error-messages.component.scss']
})
export class ValidationErrorMessagesComponent implements OnInit {

    @Input('controlName') formControl: AbstractControl;
    @Input('errors') errors: ValidationErrors | null;
    errorMessage: string;

    customPatternMessages: any[] = [
        {
            "pattrenkey": "^[a-zA-Z]$",
            "message": 'Only alphabets are allowed.'
        },
        {
            "pattrenkey": "^(0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])\\/(19|20)\\d{2}$",
            "message": 'Date format should be (MM/DD/YYYY).'
        }
    ]

    constructor(private cdR: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    ngOnChanges() {
        this.errorMessage = '';
        //console.log(this.errors);
        // if (this.formControl.touched) {
        //     if (!this.errors){
        //         return false;
        //     }
        // }

        for (const key in this.errors) {
            switch (key) {
                case 'required':
                    this.errorMessage += "The field is required.";
                    this.errorMessage += '<br>';
                    break;

                case 'minlength':
                    this.errorMessage += 'Minimum length should be ' + this.formControl.errors[key].requiredLength + ' of characters.';
                    this.errorMessage += '<br>';
                    break;

                case 'maxlength':
                    this.errorMessage += 'Maximum length should be ' + this.formControl.errors[key].requiredLength + ' of characters.';
                    this.errorMessage += '<br>';
                    break;

                case 'min':
                    this.errorMessage += 'Minimum value is ' + this.formControl.errors[key].value + '';
                    this.errorMessage += '<br>';
                    break;

                case 'max':
                    this.errorMessage += 'Maximum value is ' + this.formControl.errors[key].value + '';
                    this.errorMessage += '<br>';
                    break;

                case 'ngbDate':
                    this.errorMessage += 'Select valid date.'
                    this.errorMessage += '<br>';
                    break;

                case 'email':
                case 'ngvemail':
                    this.errorMessage += 'Please enter a valid email.'
                    this.errorMessage += '<br>';
                    break;

                case 'digits':
                    this.errorMessage += 'Only numbers are allowed in this field.'
                    this.errorMessage += '<br>';
                    break;

                case 'digitCharacterRule':
                    this.errorMessage += 'At-least 1 digit character is required'
                    this.errorMessage += '<br>';
                    break;

                case 'uppercaseCharacterRule':
                    this.errorMessage += 'At-least 1 Uppercase character is required'
                    this.errorMessage += '<br>';
                    break;

                case 'lowercaseCharacterRule':
                    this.errorMessage += 'At-least 1 Lowercase character is required'
                    this.errorMessage += '<br>';
                    break;

                case 'emailExists':
                    this.errorMessage += 'The Email you have entered Already Exists!'
                    this.errorMessage += '<br>';
                    break;

                case 'pattern':
                    let patternInfo = this.formControl.errors[key];

                    if (patternInfo && patternInfo.requiredPattern) {
                        let customMessage = this.customPatternMessages.find(
                            c => patternInfo
                                .requiredPattern
                                .replace(/\\/g, '\\\\')
                                .includes(c.pattrenkey.replace(/\\/g, '\\\\')));

                        this.errorMessage = customMessage["message"];
                        this.errorMessage += '<br>';
                    }
                    break;

                default:
                    this.errorMessage = "";
                    break;
            }
        }
        if (!this.formControl.touched){
            this.errorMessage = "";
        }
        // console.log(this.errorMessage);
        // this.element.nativeElement.innerHTML = this.errorMessage;
    }


}
