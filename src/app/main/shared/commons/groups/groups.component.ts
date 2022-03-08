import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Subject} from 'rxjs';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {DragulaService} from "ng2-dragula";
import {CdkDragDrop, CdkDragEnter, CdkDragExit} from "@angular/cdk/drag-drop";
import {FormBuilder} from "@angular/forms";
import {GroupService} from "../../../../shared/services/group.service";
import {ContactService} from "../../../../shared/services/contact.service";
import {Group, GroupMember} from "../../../../shared/models/group";
import {environment} from "../../../../../environments/environment";
import {ToastrService} from "ngx-toastr";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {Contact} from "../../../../shared/models/contact";
import {GroupMemberService} from "../../../../shared/services/group-member.service";
import Swal from 'sweetalert2';
import {GroupContextMenuComponent} from "./group-context-menu/group-context-menu.component";
import {LookupService} from "../../../../shared/services/lookup.service";
import {Lookup} from "../../../../shared/models/lookup";
import {Pagination} from "../../../../shared/models/pagination";

@Component({
    selector: 'app-group',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {
    public animatedContextMenu = GroupContextMenuComponent;

    groups: Group[] = [];
    // public
    public contentHeader: object;
    public rows: any;
    public selected = [];
    public kitchenSinkRows: any;
    public basicSelectedOption: number = 10;
    public ColumnMode = ColumnMode;
    public expanded = {};
    public editingName = {};
    public editingStatus = {};
    public editingAge = {};
    public editingSalary = {};
    public chkBoxSelected = [];
    public SelectionType = SelectionType;
    public exportCSVData;
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild(DatatableComponent) table: DatatableComponent;
    @ViewChild('tableRowDetails') tableRowDetails: any;
    // snippet code variables
    isCollapsed: boolean = true;
    groupTypes: Lookup[] = [];
    isAddContactsCollapsed: boolean = true;
    contacts: Contact[] = [];
    mainForm = this.fb.group({
        id: 0,
        name: '',
        groupType: '',
        groupTypeId: '',
        description: '',
        isPublic: false
    });
    pagination: Pagination = {
        page: 1,
        pageSize: 10,
        search: '',
        internal: true,
        typeId: -1,
    };


    // Private
    private _unsubscribeAll: Subject<any>;
    private tempData = [];

    constructor(private fb: FormBuilder, private dragulaService: DragulaService,
                private groupService: GroupService,
                private lookupService: LookupService,
                private contactService: ContactService, private toastrService: ToastrService,
                private groupMemberService: GroupMemberService) {

        // dragulaService.add('contacts-list',)
        dragulaService.createGroup('contacts-list', {
            copy: true,
            copyItem: item => {
                console.log(item);
            },

        });
    }

    ngOnDestroy(): void {
        this.dragulaService.destroy('contacts-list');
    }

    getContactFullName(contact: Contact): string {
        return contact.firstName + " " + contact.middleName + " " + contact.lastName;
    }

    ngOnInit() {
        this.blockUI.start("Loading Groups...");

        // content header
        this.contentHeader = {
            headerTitle: 'Groups',
            actionButton: true,
        };
        this.loadGroups();

        this.loadGroupTypes()

        // for (let i = 2; i < 12; i++) {
        //     this.contacts.push(
        //         {
        //             name: "Contact " + i,
        //             phone: '+1-23-3225533',
        //             email: 'some@place.com',
        //             type: 'Personal',
        //             title: 'Sn. Software Engineer',
        //             groups: [1, 2, 3, 4]
        //         }
        //     );
        // }
        // for (let i = 2; i < 5; i++) {
        //     this.groups.push(
        //         {
        //             name: "Group  " + i,
        //             description: 'This group is For General Tea',
        //             type: 'Personal',
        //             isPublic: "No",
        //             contacts: ['1', '2', '3', '+10']
        //         }
        //     );
        // }

    }

    onShowHideContacts(contactsCont: HTMLDivElement) {
        if (this.isAddContactsCollapsed) {
            this.contactService.getAll(this.pagination).subscribe(ref => {
                if (environment.showLogs)
                    console.log(ref);
                this.contacts.splice(0, this.contacts.length);
                this.contacts.push(...ref.data);
            }, error => {

            });
            contactsCont.classList.remove('hidden')
            setTimeout(() => {
                this.isAddContactsCollapsed = false;
            }, 100)
        } else {
            this.isAddContactsCollapsed = true;
            setTimeout(() => {
                contactsCont.classList.add('hidden');
            }, 1000);
        }
    }

    onDropContact($event: CdkDragDrop<any[], any>, group: Group) {
        console.log($event);
        let contact = $event.item.data;

        let hasGM = group?.groupMembers?.find(f => f.contactId === contact.id);
        console.log(hasGM);
        if (hasGM !== null && hasGM !== undefined) {

            Swal.fire({
                icon: 'error',
                title: 'Contact Already Exists!',
                customClass: {
                    confirmButton: 'btn btn-success'
                }
            });
            return;
        }

        let self = this;
        Swal.fire({
            title: 'Add Contact to Group?',
            html: `Are you sure you want to Add Contact <b>'${this.getContactFullName(contact)}'</b> to group <b>'${group.name}'</b>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7367F0',
            cancelButtonColor: '#E42728',
            confirmButtonText: 'Yes, Add it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary ml-1'
            }
        }).then(function (result) {
            if (result.value) {
                $event.container.data.push($event.item.data);
                let groupMember: GroupMember = {contactId: contact.id, groupId: group.groupId};
                self.groupMemberService.create(groupMember).subscribe(value => {
                    if (environment.showLogs)
                        console.log(value);
                    if (value.successFlag) {
                        self.loadGroups();
                        Swal.fire({
                            icon: 'success',
                            title: 'Contact Added!',
                            text: `Contact '${self.getContactFullName(contact)}' was Successfully added to group '${group.name}'!`,
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Contact Not Added to Group!',
                            text: `Contact '${self.getContactFullName(contact)}' wasn't added to group '${group.name}'. ${value.message || 'Kindly try again or Contact Support.'}`,
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
                        title: 'Contact Not Added to Group!',
                        text: `Contact '${self.getContactFullName(contact)}' wasn't added to group '${group.name}'. Kindly try again or Contact Support.`,
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    });

                });
            } else {
            }
        });

        //Contact Service...
        $event.container.element.nativeElement.classList.remove('border-success')
    }

    onDropContactEnter($event: CdkDragEnter<GroupMember[]>) {
        $event.container.element.nativeElement.classList.add('border-success')
    }

    onDropContactExit($event: CdkDragExit<GroupMember[]>) {
        $event.container.element.nativeElement.classList.remove('border-success')
    }

    loadGroups() {
        this.groupService.getAll().subscribe(
            res => {
                if (environment.showLogs)
                    console.log(res);

                if (res.data !== null && res.data.length > 0) {
                    // Clear
                    this.groups.splice(0, this.groups.length);
                    // Add
                    this.groups.push(...res.data);

                }
                this.blockUI.stop();

            }, error => {
                if (environment.logErrors)
                    console.log(error)
                this.blockUI.stop();
            }
        );
    }

    onSubmitGroup() {
        this.blockUI.start("Saving Group...");
        const ss = this.mainForm.value as Group;
        console.log(ss);
        //TODO: Remove below lines once Properly Implemented
        // delete ss.groupTypeId;
        delete ss.groupType;

        (ss.groupId === 0 || ss.groupId === null ? this.groupService.create(ss) : this.groupService.update(ss)).subscribe(res => {
            if (environment.showLogs)
                console.log(res);
            this.loadGroups();
            if (res?.successFlag) {
                this.toastrService.success(res.message)
                this.mainForm.reset({
                    id: 0,
                    name: '',
                    groupType: '',
                    groupTypeId: '',
                    description: '',
                    isPublic: false
                });
                this.isCollapsed = true;
            } else {
                this.toastrService.error(res?.message || "Some Unknown Error Occurred. Kindly Contact Support!");
            }
            this.blockUI.stop();
        }, error => {
            if (environment.logErrors)
                console.log(error);
            this.toastrService.error("Some Unknown Error Occurred. Kindly Contact Support!");
            this.blockUI.stop();
        });
        console.log(this.mainForm.value);
    }

    getTooltip(string: string, max = 15) {
        if (string === null) return '';
        return string.length > 15 ? string : '';
    }

    onGroupAction(group: Group, type: 'remove' | 'edit' | 'publicChange') {
        switch (type) {
            case "edit":
                this.mainForm.setValue({
                    id: group.groupId,
                    name: group.name,
                    groupType: group.groupType.description,
                    groupTypeId: group.groupTypeId,
                    description: group.description,
                    isPublic: false
                });
                this.isCollapsed = false;
                break;
            case "remove":
                let self = this;
                Swal.fire({
                    title: 'Delete Group?',
                    html: `You are going to Delete Group <b>'${group.name}'.</b>${group.groupMembers.length > 0 ? ' This will end up deleting the <b>' + group.groupMembers.length + '</b> Group Member References as well.' : ''} Are you sure you want to proceed?`,
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
                        self.groupService.delete(group.groupId).subscribe(value => {
                            if (environment.showLogs)
                                console.log(value);
                            if (value.successFlag && value.data) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Group Deleted!',
                                    text: `Group '${group.name}' was Successfully deleted!`,
                                    customClass: {
                                        confirmButton: 'btn btn-success'
                                    }
                                });
                                self.loadGroups();
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Group not Deleted!',
                                    text: `Couldn't Delete Group: '${group.name}'.${value.message}`,
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
                                title: 'Group not Deleted!',
                                text: `Couldn't Delete Group: '${group.name}'. Kindly try again or Contact Support.`,
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
                // console.log(group);
                this.blockUI.start("Changing Public State...");
                this.groupService.changeIsPublic(group.groupId, group.isPublic).subscribe(value => {
                    if (environment.showLogs)
                        console.log(value);
                    if (value.successFlag && value.data) {
                        this.toastrService.success(`Public View Changed for Group: ${group.name}`);
                        this.loadGroups();
                    } else {
                        this.toastrService.error(`Couldn't change Public State for Group: '${group.name}'.${value.message}`);
                    }
                    this.blockUI.stop();

                }, error => {
                    if (environment.logErrors)
                        console.log(error);
                    this.toastrService.error(`Couldn't change Public State for Group: '${group.name}'. An Unexpected Error occurred!`);
                    this.blockUI.stop();
                })
                break;
        }
    }

    onCancelGroup() {
        this.mainForm.reset({
            id: 0,
            name: '',
            groupType: '',
            groupTypeId: '',
            description: '',
            isPublic: false
        });
        this.isCollapsed = true;
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

    private loadGroupTypes() {
        // this.lookupService.getTypes("Group", "Type").
        this.lookupService.getAllByParam("Group", "Type", "ALL", "0", true, true).subscribe(value => {
            if (environment.logErrors)
                console.log(value);
            if (value.successFlag) {
                this.groupTypes = [...value.data];
            }
        })
    }

}
