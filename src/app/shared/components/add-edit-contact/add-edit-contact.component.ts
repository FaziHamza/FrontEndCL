import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {repeaterAnimation} from "../../../../@core/animations/core.animation";
import {ContactService} from 'app/main/shared/commons/contact.service';
import {Contact} from "../../models/contact";
import {Lookup} from "../../models/lookup";
import {LookupService} from "../../services/lookup.service";
import {environment} from "../../../../environments/environment.prod";

@Component({
    selector: 'app-add-edit-contact',
    templateUrl: './add-edit-contact.component.html',
    styleUrls: ['./add-edit-contact.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None
})
export class AddEditContactComponent implements OnInit {
    contactTypes: Lookup[] = [];

    contactType: string = "";
    textFieldMaxLength: number = 15;

    @Input('useCompactLayout') useCompactLayout = false;
    @Output('onSubmitClicked') onContactClicked: EventEmitter<any> = new EventEmitter<any>();
    @Input('onSubmitClicked') onSubmitClicked: EventEmitter<any>;
    @Input('onContactModelUpdated') onContactModelUpdated: EventEmitter<Contact>;
    @Input('contactModel') contactModel: Contact = {contactId: 0};
    contactForm = this.fb.group({
        contactId: 0,
        firstName: '',
        middleName: '',
        lastName: '',
        contactType: '',
        contactTypeId: '',
        title: '',
        detail: '',
        email: '',
        phone: '',
        phoneNumbers: this.fb.array([
            this.fb.group({
                id: '',
                type: 'PhoneNo',
                subType: '',
                value: '',
                isActive: true,
                isDefault: true
            })
        ]),
        emails: this.fb.array([this.fb.group({
            id: '',
            type: 'Email',
            subType: '',
            value: '',
            isActive: true,
            isDefault: true
        })])
    });

    constructor(private fb: FormBuilder, private lookupService: LookupService, public contactService: ContactService) {
        this.loadContactTypes();
    }

    get emails() {
        return this.contactForm.get('emails') as FormArray;
    }

    get emailControls() {
        return (this.emails.controls as FormGroup[]).filter(f => f.value.isActive !== false)
    }

    get phoneNumbers() {
        return (this.contactForm.get('phoneNumbers') as FormArray);
    }

    get phoneNumberControls() {
        return (this.phoneNumbers.controls as FormGroup[]).filter(f => f.value.isActive !== false);
    }

    loadContactModel() {
        if (this.contactModel !== null && this.contactModel !== undefined && this.contactModel.contactId !== 0) {
            //TODO: Implement Array Data Assigning as well.
            Object.keys(this.contactModel).filter(f => (this.useCompactLayout ? f !== "emails" && f !== "phoneNumbers" : f !== null)).forEach(name => {
                console.log(name);
                if ((name === 'emails' || name === 'phoneNumbers') && this.contactForm.controls[name]) {
                    ((this.contactForm.get(name) as FormArray)).clear();
                    this.contactModel[name].forEach(val => {
                        ((this.contactForm.get(name) as FormArray)).push(this.fb.group({
                            id: val?.contactId || '',
                            type: val?.type || '',
                            subType: val?.subType || '',
                            value: val?.value || '',
                            isActive: true,
                            isDefault: val?.isDefault || ''
                        }));
                    })
                } else if (this.contactForm.controls[name]) {
                    this.contactForm.controls[name].patchValue(this.contactModel[name] === null || this.contactModel[name] === undefined ? '' : this.contactModel[name], {onlySelf: true});
                }

            });
        }
    }

    ngOnInit(): void {
        console.log(this.contactModel);
        this.loadContactModel();
        if (this.onSubmitClicked !== undefined) {
            this.onSubmitClicked.subscribe(value => {
                debugger
                if (value) {
                    let isFormValid = this.contactForm.valid;
                    if (isFormValid) {
                        this.onContactSubmitted();
                    }
                } else {
                    // this.contactForm.reset();
                    // this.onResetForm();
                }
            })
        }
        if (this.onContactModelUpdated !== undefined) {
            this.onContactModelUpdated.subscribe(value => {
                if (value) {
                    this.contactModel = value;
                    this.loadContactModel();
                } else {
                    this.contactForm.reset({
                        contactId: 0,
                        firstName: '',
                        middleName: '',
                        lastName: '',
                        contactType: '',
                        contactTypeId: '',
                        title: '',
                        detail: '',
                        email: '',
                        phone: '',
                        phoneNumbers: [
                            {
                                id: 0,
                                type: 'PhoneNo',
                                subType: '',
                                value: '',
                                isActive: true,
                                isDefault: true
                            }
                        ],
                        emails: [
                            {
                                id: 0,
                                type: 'Email',
                                subType: '',
                                value: '',
                                isActive: true,
                                isDefault: true
                            }
                        ]
                    });
                    this.emails.controls.splice(1, this.emails.controls.length);
                    this.phoneNumbers.controls.splice(1, this.emails.controls.length);
                }
            })
        }
    }

    reDoFirstOne(type: 'phone' | 'email') {
        if (this.phoneNumbers.length > 0 && type === 'phone')
            this.phoneNumberControls[0].patchValue({isDefault: true}, {onlySelf: true});

        if (this.emails.length > 0 && type === 'email')
            this.emailControls[0].patchValue({isDefault: true}, {onlySelf: true});

    }

    deleteItem(i: number, isDefault: boolean, type: "phone" | "email") {
        if (type === 'phone') {
            if (this.phoneNumbers.length === 1) return; //NOTE: Could show a toast explaining why they couldn't remove it..
            ((this.contactForm.get('phoneNumbers') as FormArray).controls as FormGroup[])[i].patchValue({
                    isActive: false
                }, {onlySelf: true}
            );
            if (isDefault)
                this.reDoFirstOne(type);
        } else {
            if (this.emails.length === 1) return;
            ((this.contactForm.get('emails') as FormArray).controls as FormGroup[])[i].patchValue({
                    isActive: false
                }, {onlySelf: true}
            );
            if (isDefault)
                this.reDoFirstOne(type);
        }
    }

    addItem(type: string) {
        if (type === 'phone') {
            ((this.contactForm.get('phoneNumbers') as FormArray).controls as FormGroup[]).push(this.fb.group({
                id: 0,
                type: 'PhoneNo',
                subType: '',
                value: '',
                isActive: true,
                isDefault: this.phoneNumbers.length === 0
            }));
        } else {
            ((this.contactForm.get('emails') as FormArray).controls as FormGroup[]).push(this.fb.group({
                id: 0,
                type: 'Email',
                subType: '',
                value: '',
                isActive: true,
                isDefault: this.emails.length === 0
            }));
        }


    }

    onChangeDefault(index1: number, isDef: HTMLInputElement, type: "phone" | "email") {
        if (!isDef.checked) {
            isDef.checked = true;
            // return;
        }
        console.log('onChange', index1, type, this.phoneNumbers, this.emails);
        if (type === 'phone') {
            ((this.contactForm.get('phoneNumbers') as FormArray).controls as FormGroup[]).forEach((value, index) => {
                value.controls.isDefault.patchValue(index1 === index, {onlySelf: true});
            })
        } else {
            ((this.contactForm.get('emails') as FormArray).controls as FormGroup[]).forEach((value, index) => {
                value.controls.isDefault.patchValue(index1 === index, {onlySelf: true});
            })
        }
    }

    onResetForm() {
        this.reDoFirstOne('phone');
        this.reDoFirstOne('email');
    }

    private onContactSubmitted() {
        // console.log(this.contactForm.value);
        // console.log(this.contactForm);
        //
        debugger
        if (this.contactForm.valid)
            this.onContactClicked.emit(this.contactForm.value);
    }

    private loadContactTypes() {
        // this.lookupService.getTypes("Contact", "Type").
        this.lookupService.getTypes("Contact", "Type").subscribe(value => {
            if (environment.logErrors)
                console.log(value);
            if (value.successFlag) {
                this.contactTypes = [...value.data];
            }
        })
    }
}
