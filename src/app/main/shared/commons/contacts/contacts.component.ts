import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {ContactContextMenuComponent} from "../../../user/profile/user-info/contact-context-menu/contact-context-menu.component";
import {repeaterAnimation} from "../../../../../@core/animations/core.animation";
// import {ContactService} from '../contact.service';
import {environment} from 'environments/environment.prod';
import {ToastrService} from 'ngx-toastr';
import {ContactService} from "../../../../shared/services/contact.service";
import {Contact} from "../../../../shared/models/contact";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {Pagination} from "../../../../shared/models/pagination";
import Swal from "sweetalert2";
import {AuthenticationService} from "../../../../shared/services/authentication.service";
import {LookupService} from "../../../../shared/services/lookup.service";
import {ContactTypeLookup} from "../../../../shared/models/lookup";
import {ContentHeader} from "../../../../layout/components/content-header/content-header.component";

@Component({
    selector: 'app-contact-sample',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None 
})

export class ContactsComponent implements OnInit {

    public animatedContextMenu = ContactContextMenuComponent;
    public contentHeader: ContentHeader;
    currentPage = 1;
    disableBtn: boolean = false;
    txtAlert: '1111';
    itemsPerPage = environment.pageSize;
    @Output('onSubmitClicked') onContactClicked: EventEmitter<any> = new EventEmitter<any>();
    showContactCollapse: boolean = false;
    contactTypes: ContactTypeLookup[] = [];
    contactType: string = "";
    phoneNumbers = [{
        type: '',
        phone: '',
        isDefault: true
    }];
    emails = [{
        type: '',
        email: '',
        isDefault: true
    }];
    onContactSubmit: EventEmitter<any> = new EventEmitter<any>();
    onContactModelUpdated: EventEmitter<Contact> = new EventEmitter<Contact>();
    contact: Contact = {contactId: 0};
    public pageAdvancedEllipses = 1;
    searchExternal: boolean = false;
    searchText: string = '';
    contacts: Contact[] = [];
    paginator: any = {totalCount: 0};
    @BlockUI() blockUI: NgBlockUI;
    //     this.reDoFirstOne('phone');
    activeContactTypeId: number = 0;
    activeContactType: ContactTypeLookup;
    hoursDay: boolean = true;
    pagination: Pagination = {
        page: this.currentPage,
        pageSize: this.itemsPerPage,
        search: this.searchText,
        internal: !this.searchExternal,
        typeId: this.activeContactTypeId,
        organizationId: 9
    };

    constructor(private changeDetector: ChangeDetectorRef, public contactService: ContactService,
                private lookupService: LookupService,
                private toastrService: ToastrService, private authenticationService: AuthenticationService) {
    }

    setupPagination(pagination: Pagination = null) {
        if (pagination !== null && pagination.search === null) pagination.search = '';

        this.pagination = pagination === null ? {
            page: environment.page,
            pageSize: environment.pageSize,
            search: '',
            internal: true,
            organizationId: this.authenticationService.currentOrganizationValue.organizationId,
        } : pagination;

        this.pagination.typeId = this.activeContactTypeId;
    }

    loadContacts() {
        debugger
        this.blockUI.start("Loading Contacts...")
        this.contactService.getAllPagination(this.pagination).subscribe(res => {
            console.log(res);
            if (res.successFlag) {
                this.contacts.splice(0, this.contacts.length);
                this.contacts.push(...res.data)
            }
            this.setupPagination(res.miscData);
            this.blockUI.stop();
        });
    }

    ngOnInit() {
        this.loadContactTypes(() => {
            this.setupPagination();
            this.loadContacts();
        });

        this.contentHeader = {
            headerTitle: '',
            actionButton: true
        }
    }

    // onResetForm() {

    reDoFirstOne(type: 'phone' | 'email') {
        if (this.phoneNumbers.length > 0 && type === 'phone')
            this.phoneNumbers[0].isDefault = true;

        if (this.emails.length > 0 && type === 'email')
            this.emails[0].isDefault = true

    }

    deleteItem(i: number, isDefault: boolean, type: "phone" | "email") {
        if (type === 'phone') {
            if (this.phoneNumbers.length === 1) return; //NOTE: Could show a toast explaining why they couldn't remove it..
            this.phoneNumbers.splice(i, 1);
            if (isDefault)
                this.reDoFirstOne(type);
        } else {
            if (this.emails.length === 1) return;
            this.emails.splice(i, 1);
            if (isDefault)
                this.reDoFirstOne(type);
        }
    }

    addItem(type: string) {
        if (type === 'phone') {
            this.phoneNumbers.push({
                type: '',
                phone: '',
                isDefault: this.phoneNumbers.length === 0
            });
        } else {
            this.emails.push({
                type: '',
                email: '',
                isDefault: this.emails.length === 0
            })
        }


    }

    onChangeDefault(index1: number, isDef: HTMLInputElement, type: "phone" | "email") {
        if (!isDef.checked) {
            isDef.checked = true;
            return;
        }
        console.log('onChange', index1, type, this.phoneNumbers, this.emails);
        if (type === 'phone') {
            this.phoneNumbers.forEach((value, index) => {
                value.isDefault = index1 === index;
            })

            // if (item.isDefault !== true)
            //     this.reDoFirstOne(type)
        } else {
            this.emails.forEach((value, index) => {
                value.isDefault = index1 === index;
            })
            // if (item.isDefault !== true)
            //     this.reDoFirstOne(type)
        }
    }

    onContactSubmitted(contact: any) {
        this.blockUI.start("Saving Contact...");
debugger
        console.log(contact);
        delete contact.contactType;
        // delete contact.contactTypeId;
        debugger
        this.contact = contact;
        this.contact.email = contact.emails.find(f => f.isDefault === true).value;
        this.contact.phone = contact.phoneNumbers.find(f => f.isDefault === true).value;
        this.contact.contactDetails = [...this.contact.emails.map(ff => {
            if (ff.contactId === '') ff.contactId = 0;
            return ff;
        }), ...this.contact.phoneNumbers.map(ff => {
            if (ff.id === '') ff.id = 0;
            return ff;
        })];

        // this.contactService.saveContact = this.contact;
        // debugger
        (this.contact.contactId === 0 ? this.contactService.create(this.contact) : this.contactService.update(this.contact))
            .subscribe(res => {
                if (environment.showLogs)
                    console.log(res);
                if (res.successFlag) {
                    this.loadContactTypes(() => {
                        this.loadContacts();
                    });
                    this.toastrService.success('Contact Successfully Saved!');
                    this.showContactCollapse = false;
                    this.onContactClear();
                } else {
                    this.toastrService.error(`Couldn't Save Contact. ${res.message}`);
                }
                this.blockUI.stop();
            }, error => {
                if (environment.logErrors)
                    console.log(error);
                this.toastrService.error("Couldn't Save Contact. An Unexpected Error Occurred!");
                this.blockUI.stop();
            });
    }

    onSearchContactsClick() {
        // debugger

        if (this.searchText.includes('@')) {
            var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            console.log(regexp.test(String(this.searchText).toLowerCase()))
            var res = regexp.test(String(this.searchText).toLowerCase())
            if (res != true) {
                this.disableBtn = true;
                this.toastrService.error(
                    'please add valid email' +
                    ' ',
                    'error',
                    {toastClass: 'toast ngx-toastr', closeButton: true}
                );
                this.disableBtn = false
            } else {
                this.loadContactTypes(() => {
                    this.loadContacts();
                });;
            }
        } else {
            this.disableBtn = false;
            if (this.searchText != null)
                this.loadContactTypes(() => {
                    this.loadContacts();
                });
            else
                this.loadContactTypes(() => {
                    this.loadContacts();
                });
        }

    }

    onSearchClear() {
        this.pagination.search = '';
        this.loadContactTypes(() => {
            this.loadContacts();
        });
    }

    public onPageChange(pageNum: number): void {
        if (isNaN(pageNum))
            pageNum = 1;
        this.currentPage = pageNum;
        this.loadContactTypes(() => {
            this.loadContacts();
        });
    }

    public searchExternalCheck() {
        // debugger
        this.searchExternal = !this.searchExternal;
        this.loadContactTypes(() => {
            this.loadContacts();
        });
    }

    filterFunction(collectionList): any[] {

        if (collectionList)
            return collectionList.split(',');
    }

    filterFunctionCount(collectionList): number {
        var Countdata = collectionList.split(',');
        if (collectionList) return Countdata.length;
        else return 0;
    }

    getContactFullName(contact: Contact): string {
        return contact.firstName + " " + contact.middleName + " " + contact.lastName;
    }

    onContactAction(contact: any, type: 'publicChange' | 'edit' | 'remove') {
        switch (type) {
            case "edit":
                this.editForm(contact);
                this.showContactCollapse = true;
                break;
            case "remove":
                let self = this;
                Swal.fire({
                    title: 'Delete Contact?',
                    html: `You are going to Delete Contact <b>'${this.getContactFullName(contact)}'</b>.${contact.groupMembers.length > 0 ? ' This will end up deleting the <b>' + contact.groupMembers.length + '</b> Group Member References as well.' : ''} Are you sure you want to proceed?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#7367F0',
                    cancelButtonColor: '#E42728',
                    confirmButtonText: 'Yes, Delete it!',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-secondary ml-1'
                    }
                }).then(function (result) {
                    if (result.value) {
                        self.contactService.delete(contact.id).subscribe(value => {
                            if (environment.showLogs)
                                console.log(value);
                            if (value.successFlag && value.data) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Contact Deleted!',
                                    text: `Contact '${self.getContactFullName(contact)}' was Successfully deleted!`,
                                    customClass: {
                                        confirmButton: 'btn btn-success'
                                    }
                                });
                                self.loadContacts();
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Contact not Deleted!',
                                    text: `Couldn't Delete Contact: '${self.getContactFullName(contact)}'.${value.message}`,
                                    customClass: {
                                        confirmButton: 'btn btn-success'
                                    }
                                });
                            }
                        }, error => {
                            if (environment.logErrors)
                                console.log(error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Contact not Deleted!',
                                text: `Couldn't Delete Contact: '${self.getContactFullName(contact)}'. Kindly try again or Contact Support.`,
                                customClass: {
                                    confirmButton: 'btn btn-success'
                                }
                            });
                        });
                    } else {
                    }
                });
                break;
            case "publicChange":
                this.blockUI.start("Changing Public State...");
                this.contactService.changeIsPublic(contact.id, contact.isPublic).subscribe(value => {
                    if (environment.showLogs)
                        console.log(value);
                    if (value.successFlag && value.data) {
                        this.toastrService.success(`Public View Changed for Contact: ${contact.name}`);
                        this.loadContactTypes(() => {
                            this.loadContacts();
                        });
                    } else {
                        this.toastrService.error(`Couldn't change Public State for Contact: '${contact.name}'.${value.message}`);
                    }
                    this.blockUI.stop();

                }, error => {
                    if (environment.logErrors)
                        console.log(error);
                    this.toastrService.error(`Couldn't change Public State for Contact: '${contact.name}'. An Unexpected Error occurred!`);
                    this.blockUI.stop();
                })
                break;
        }
    }

    editForm(contact: Contact) {
        this.contact.contactId = contact.contactId;
        this.contact.firstName = contact.firstName;
        this.contact.middleName = contact.middleName;
        this.contact.lastName = contact.lastName;
        this.contact.contactTypeId = contact.contactTypeId;
        this.contact.title = contact.title;
        this.contact.detail = contact?.detail || '';
        this.contact.emails = contact.contactDetails.filter(f => f.type === 'Email').map((value, index) => {
            return {
                ...value,
                isDefault: value.value === contact.email
            };
        })
        this.contact.phoneNumbers = contact.contactDetails.filter(f => f.type === 'PhoneNo').map((value, index) => {
            return {
                ...value,
                isDefault: value.value === contact.phone
            };
        })
        console.log(this.contact);
        this.onContactModelUpdated.emit(this.contact);
        this.showContactCollapse = true;
    }

    onContactClear() {
        this.showContactCollapse = !this.showContactCollapse;
        this.clearContact();
        this.onContactModelUpdated.emit(null);
    }

    onSubmitContactForm() {
        this.onContactSubmit.emit(true)
    }

    onContactTypeChange() {
        console.log("Type", this.activeContactTypeId);
        this.setupPagination(this.pagination);
        this.loadContacts();
    }

    private loadContactTypes(onComplete = null) {
        debugger
        this.contactService.getContactTypes().subscribe(value => {
            if (environment.logErrors)
                console.log(value);
            if (value.successFlag) {
                this.contactTypes = [...value.data, {lookupId: 0, description: 'Unknown', countOfContacts: value.miscData}];	
                if (this.contactTypes[0] !== undefined) {	
                    this.activeContactTypeId = this.contactTypes[0].lookupValue;
                    this.activeContactType = this.contactTypes[0];
                }
            }
            if (onComplete !== null) {
                onComplete();
            }

        })
    }

    private clearContact() {
        Object.keys(this.contact).forEach(key => {
            this.contact[key] = '';
        })
    }
}
