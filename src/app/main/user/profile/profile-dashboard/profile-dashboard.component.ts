import {Component, OnInit, TemplateRef} from '@angular/core';
import Swal from 'sweetalert2';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AbstractControl, FormGroup, NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {validate, validateControl} from 'app/shared/models/helpers';

@Component({
    selector: 'app-profile-dashboard',
    templateUrl: './profile-dashboard.component.html',
    styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {

    public contentHeader: object
    public firstName = '';
    isEdit: false;
    isEditAddress: boolean = false;
    languages = [{name: 'EN'}, {name: 'IT'}];
    language = '';
    dateOfBirth: any;
    genders = [{name: 'Male'}, {name: 'Female'}];
    workExperiences = [
        {
            id: 1,
            organizationId: -1,
            organizationName: 'Microsoft',
            organizationLogo: '',
            title: 'Snr. Developer',
            skills: ['C#', 'ASP.NET', 'GoLang'],
            startDate: '',
            endDate: '',
            isPublic: false

        },
        {
            id: 2,
            organizationId: -1,
            organizationName: 'HBL',
            organizationLogo: '',
            title: 'Junior Developer',
            skills: ['Angular', 'Angular.js', 'React.js', 'Angular', 'Angular.js', 'React.js', 'Angular', 'Angular.js', 'React.js'],
            startDate: '',
            endDate: '',
            isPublic: true

        }];

    references = [
        {
            id: 1,
            firstName: 'Abid',
            middleName: 'Ali',
            lastName: 'Aslam',
            imgUrl: '',
            email: 'info@gmail.com',
            referenceType: 'Personal',
            referenceTypeId: 1
        },
        {
            id: 2,
            firstName: 'Ahmad',
            middleName: 'Ali',
            lastName: 'Hassan',
            imgUrl: '',
            email: 'ghy@ingo.com',
            referenceType: 'Official',
            referenceTypeId: 2
        }];

    educations = [
        {
            id: 1,
            title: 'Bachelors in Software Engineering',
            instituteName: 'LUMS',
            instituteLogo: '',
            degreeType: 'Bachelors',
            gpa: '3.23',
            startDate: '2017-02-10T00:00:00Z',
            endDate: '2021-09-10T00:00:00Z',
            isCurrent: true,
            address: {
                address1: '',
                address2: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            },
            detail: 'These will be the Details of the education',
            isPublic: false
        }
    ];
    skills = [
        {id: 1, isCurrent: false, isPublic: true, name: 'ASP.NET'},
    ];

    maritalStatuses = [{name: 'Single'}, {name: 'Married'}, {name: 'Divorced'}];
    maritalStatus: any = 'Single';
    gender: any = '';
    isEditProfileMode: boolean = false;
    userInfo = {
        id: '2',
        firstName: 'Syed Ali',
        lastName: 'Naqi',
        phoneNo: '0316-4403123',
        fullName: 'Syed Ali Naqi',
        status: 'active',
        avatar: '',
        rating: 4,
        email: 'syedalinaqi82@gmail.com',
        addresses: [{
            id: 1,
            address1: 'Ad# 09577 CJ. USA',
            address2: 'Far Away Location',
            city: 'Some Place',
            state: 'Punjab',
            country: 'Pakistan',
            isCurrent: false,
            isPublic: false
        }, {
            id: 2,
            address1: 'Office # 105, Floor 1, Al-Hafeez Heights',
            address2: 'Main Bulevard Gulberg 3',
            city: 'Lahore',
            state: 'Punjab',
            country: 'Pakistan',
            isCurrent: false,
            isPublic: false
        }
        ]
    };
    private form: FormGroup;
    selectedData: any = {};
    ngbModalRef: NgbModalRef;
    currentAddress: number = 0;

    constructor(private modalService: NgbModal, private toastr: ToastrService) {
        for (let i = 2; i <= 10; i++) {
            this.skills.push({id: i, isCurrent: (i % 2 === 0), isPublic: (i % 2 !== 0), name: 'ASP.NET ' + i});
        }
    }

    ngOnInit() {
        this.contentHeader = {
            headerTitle: 'USER',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'USER',
                        isLink: true,
                        link: '/'
                    },
                    {
                        name: 'profile',
                        isLink: false
                    }
                ]
            }
        }
    }

    onEditSaveClick() {
        this.isEditProfileMode = !this.isEditProfileMode;
        this.isEditAddress = false;

        if (!this.isEditProfileMode) {
            console.log('On Save!');
        }
    }

    onSkillCrossClick(item: { isCurrent: boolean; name: string; isPublic: boolean; id: number }) {
        console.log(item);
        this.skills.splice(this.skills.indexOf(item), 1);
    }

    getSkills(type: 'current' | 'not-current') {
        if (type === 'current')
            return this.skills.filter(f => f.isCurrent)
        else
            return this.skills.filter(f => !f.isCurrent)

    }

    onSkillChange(item: { isCurrent: boolean; name: string; isPublic: boolean; id: number }, isCurrent: boolean) {
        if (isCurrent) {
            // It's isCurrent Change
            console.log(item)
        } else {
            // It's IsPublic change
            console.log(item)

        }
    }

    onReferenceAction(item: any, action: 'remove' | 'edit' | 'click', addReferenceModal = null) {
        let self = this;
        if (action === 'remove') {
            Swal.fire({
                title: 'Remove Reference!',
                text: `Are you sure you want to Remove Reference with name '${item.name}'?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7367F0',
                cancelButtonColor: '#E42728',
                confirmButtonText: 'Yes, remove it!',
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary ml-1'
                }
            }).then(function (result) {
                if (result.value) {
                    self.references.splice(self.references.indexOf(item), 1);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Reference Has been successfully Deleted!',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    });
                }
            });
        } else {
            console.log()
            this.selectedData = item;
            this.ngbModalRef = this.modalService.open(addReferenceModal, {centered: true});
        }
    }


    addReferenceClick(addReferenceModal: TemplateRef<any>) {
        this.ngbModalRef = this.modalService.open(addReferenceModal, {centered: true});
    }

    onSubmitReferenceForm(data: { form: FormGroup }) {
        this.form = data.form;
    }

    onSubmitReferenceClick() {
        if (this.form === undefined || this.form === null)
            return;
        console.log(this.form.value);
        if (ProfileDashboardComponent.isValid(this.form.value.id)) {
            // Edit Mode (call the server to update)
            let old = this.references.find(f => f.id === this.form.value.id);
            Object.keys(this.form.value).forEach(key => {
                old[key] = this.form.value[key];
            })
            this.toastr.success('Reference Successfully Updated!', 'Success!', {
                toastClass: 'toast ngx-toastr',
                closeButton: true
            });
        } else {
            // Add Mode
            this.form.value.id = this.references.length + 1;
            this.references.push(this.form.value);
            this.toastr.success('Reference Added Successfully!', 'Success!', {
                toastClass: 'toast ngx-toastr',
                closeButton: true
            });
        }
        this.ngbModalRef.close();
    }

    private static isValid(id): boolean {
        return id !== undefined && id !== null && id !== '' && id !== 0;
    }

    validateControl(control: AbstractControl) {
        return validateControl(control)
    }

    validate(form, controlName) {
        return validate(form, controlName)
    }

    getFullName(item: { imgUrl: string; firstName: string; lastName: string; referenceTypeId: number; referenceType: string; middleName: string; id: number; email: string }) {
        return item.firstName + ' ' + item.middleName + ' ' + item.lastName;
    }

    onSubmitForm(data: { form: FormGroup }) {
        this.form = data.form;
    }

    onWorkExperienceAction(referenceModel: TemplateRef<any> | null, item: any, type: 'add' | 'edit' | 'remove' | 'publicChange') {
        switch (type) {
            case "add":
                this.selectedData = null;
                this.ngbModalRef = this.modalService.open(referenceModel, {centered: true});
                break;
            case "edit":
                this.selectedData = item;
                this.ngbModalRef = this.modalService.open(referenceModel, {centered: true});
                break;
            case "remove":
                let self = this;
                this.showRemovePopup('Work Experience', item.name, () => {
                    self.workExperiences.splice(self.workExperiences.indexOf(item), 1);
                });
                break;
            case "publicChange":
                this.toastr.success(`Work Experience Successfully Updated!`, 'Success!', {
                    toastClass: 'toast ngx-toastr',
                    closeButton: true
                });
                break;
        }
    }

    private showRemovePopup(type, name, action) {
        Swal.fire({
            title: `Remove ${type}!`,
            text: `Are you sure you want to Remove Reference with name '${name}'?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7367F0',
            cancelButtonColor: '#E42728',
            confirmButtonText: 'Yes, remove it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary ml-1'
            }
        }).then(function (result) {
            if (result.value) {
                action();
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: `${type} Has been successfully Deleted!`,
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                });
            }
        });
    }

    baseSubmitData(type, dataArr, updateForm = null, custom = null) {
        if (this.form === undefined || this.form === null)
            return;
        for (let controlKey in this.form.controls) {
            this.form.controls[controlKey].markAsTouched();
        }
        console.log(this.form.value, this.form.valid, this.form);
        if (this.form.invalid) {
            this.toastr.error(`Unable to save ${type}. There are some Validation Errors. Kindly fix them!`, 'Validation Error!', {
                toastClass: 'toast ngx-toastr',
                closeButton: true
            });
            return;
        }
        if (custom !== null) {
            custom();
        } else {
            if (ProfileDashboardComponent.isValid(this.form.value.id)) {
                // Edit Mode (call the server to update)
                let old = dataArr.find(f => f.id === this.form.value.id);
                Object.keys(this.form.value).forEach(key => {
                    old[key] = this.form.value[key];
                })
                this.toastr.success(`${type} Successfully Updated!`, 'Success!', {
                    toastClass: 'toast ngx-toastr',
                    closeButton: true
                });
            } else {
                // Add Mode
                this.form.value.id = dataArr.length + 1;
                if (updateForm !== null)
                    updateForm();
                dataArr.push(this.form.value);
                this.toastr.success(`${type} Added Successfully!`, 'Success!', {
                    toastClass: 'toast ngx-toastr',
                    closeButton: true
                });
            }
        }

        this.ngbModalRef.close();
    }

    onSubmitExperience() {
        this.baseSubmitData('Work Experience', this.workExperiences, () => {
            this.form.value.organizationLogo = '';
        });
    }

    onEducationAction(referenceModel: TemplateRef<any> | null, item: any, type: 'add' | 'edit' | 'remove' | 'publicChange') {
        switch (type) {
            case "add":
                this.selectedData = null;
                this.ngbModalRef = this.modalService.open(referenceModel, {centered: true});
                break;
            case "edit":
                this.selectedData = item;
                this.ngbModalRef = this.modalService.open(referenceModel, {centered: true});
                break;
            case "remove":
                let self = this;
                this.showRemovePopup('Education', item.name, () => {
                    self.workExperiences.splice(self.workExperiences.indexOf(item), 1);
                });
                break;
            case "publicChange":
                this.toastr.success(`Education Successfully Updated!`, 'Success!', {
                    toastClass: 'toast ngx-toastr',
                    closeButton: true
                });
                break;
        }
    }

    onSubmitEducation() {
        this.baseSubmitData('Education', this.educations, () => {
            this.form.value.instituteLogo = '';
        });
    }

    onSubmitSkill() {
        this.baseSubmitData('Work Experience', this.skills, null, () => {
            this.form.value.skills.forEach(v => {
                this.skills.push({id: v, name: v, isPublic: false, isCurrent: false});
            })
        });
    }

    onAddSkillClick(addSkillsModal: TemplateRef<any>) {
        this.ngbModalRef = this.modalService.open(addSkillsModal, {centered: true});
    }

    getCurrentAddress() {
        return this.userInfo.addresses.filter((value, index) => index === this.currentAddress);
    }

    onChangeAddress(type: 'prev' | 'next') {
        if (this.isEditAddress) {
            this.toastr.error('You cannot change address if edit for an address is in progress. Save it first!', "Can't Change Address!", {
                toastClass: 'toast ngx-toastr',
                closeButton: true
            });
            return;
        }
        if (type === 'prev') {
            if (this.currentAddress >= 1) {
                this.currentAddress--;
            }
        }
        if (type === 'next') {
            if (this.currentAddress < (this.userInfo.addresses.length - 1)) {
                this.currentAddress++;
            }
        }
    }

    onAddAddress() {
        this.userInfo.addresses.push({
            id: (this.userInfo.addresses.length + 1),
            address1: '',
            address2: '',
            city: '',
            state: '',
            country: '',
            isCurrent: false,
            isPublic: false
        })
        this.currentAddress = (this.userInfo.addresses.length - 1);
        this.isEditAddress = true;
    }

    onEditAddress() {
        if (!this.isEditAddress) {
            // simply edit it
        } else {
            // Save Changes if made
            let addressToSave = this.userInfo.addresses.filter((value, index) => index === this.currentAddress)[0];
            // you can simply post the above model.
        }
        this.isEditAddress = !this.isEditAddress;
    }
}
