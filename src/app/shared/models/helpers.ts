import {AbstractControl, FormGroup} from "@angular/forms";

export function validate(form: FormGroup, controlName: string): any {
    return {
        'is-invalid': form.controls[controlName].touched && form.controls[controlName].errors,
        'is-valid': form.controls[controlName].touched && form.controls[controlName].valid
    };
}

export function validateControl(controlName: AbstractControl): any {
    return {
        'is-invalid': controlName.touched && controlName.errors,
        'is-valid': controlName.touched && controlName.valid
    };
}

export function cleanObject<T>(obj: any): T {
    for (let objKey in obj) {
        if (obj[objKey] === '') {
            delete obj[objKey];
        }
    }
    return obj;
}
