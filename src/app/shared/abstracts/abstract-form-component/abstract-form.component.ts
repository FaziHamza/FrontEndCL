import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
    template: `
    `,
    styleUrls: ['./abstract-form.component.scss']
})
export class AbstractFormComponent<T> implements OnInit {
    textFieldMaxLength: number = 15;

    constructor() {
    }

    mainForm: FormGroup;
    @Output('onSubmitForm') onSubmitForm: EventEmitter<{ form: FormGroup, }> = new EventEmitter<{ form: FormGroup }>();
    @Input('data') data: T;

    ngOnInit() {
        this.onSubmitForm.emit({form: this.mainForm});
        console.log(this.data);
        if (this.data !== undefined && this.data !== null) {
            Object.keys(this.data).forEach(name => {
                if (this.mainForm.controls[name]) {
                    this.mainForm.controls[name].patchValue(this.data[name], {onlySelf: true});
                }
            });
        }
    }

    onFormSubmit() {
        this.onSubmitForm.emit({form: this.mainForm});
    }
}
