import { Component, EventEmitter, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import Stepper from "bs-stepper";
import { repeaterAnimation } from "../../../../@core/animations/core.animation";
import { NgbDate, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { OrganizationService } from 'app/shared/services/organization.service';
import { ToastrService } from 'ngx-toastr';
import { Job } from "../../../shared/models/job";
import { JobService } from "../../../shared/services/job.service";
import { cleanObject } from "../../../shared/models/helpers";
import { EmployeeInitialSetupService } from "../../../shared/services/employee-initial-setup.service";
import { TimesheetService } from "../../../shared/services/timesheet.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { environment } from "../../../../environments/environment";
import { EmployeeInitialSetup, EmployeeInitialSetupListDto } from "../../../shared/models/employeeInitialSetup";
import { ContactService } from "../../../shared/services/contact.service";
import { Contact } from "../../../shared/models/contact";
import { AuthenticationService } from "../../../shared/services/authentication.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { Organization, OrgizationConfiguzartionLookup } from 'app/shared/models/organization';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';

@Component({
    selector: 'app-employee-contractor-wizard',
    templateUrl: './employee-contractor-wizard.component.html',
    styleUrls: ['./employee-contractor-wizard.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None
})
export class EmployeeContractorWizardComponent implements OnInit {
    // jobs: Job[] = [];
    timeSheets: any[] = [];
    onCreateJobE: EventEmitter<any> = new EventEmitter<any>();
    onCreateOrganization: EventEmitter<any> = new EventEmitter<any>();
    onCreateContact: EventEmitter<any> = new EventEmitter<any>();
    organization : Organization=null;
    email = null;
    website = null;
    tempOrgId: number = 0;

    job: Job = { jobId: 0 };
    public contact: Contact = null;
    public selected = "";
    public TDNameVar;
    public TDEmailVar;
    public TDFirstNameVar;
    public TDLastNameVar;
    public twitterVar;
    public facebookVar;
    public googleVar;
    public linkedinVar;
    public landmarkVar;
    public addressVar;
    public selectBasic = [
        { name: 'UK' },
        { name: 'USA' },
        { name: 'Spain' },
        { name: 'France' },
        { name: 'Italy' },
        { name: 'Australia' }
    ];
    public selectMulti = [{ name: 'English' }, { name: 'French' }, { name: 'Spanish' }];
    public selectMultiSelected;
    public contentHeader: object
    autoTimeSheetGeneration: boolean = false;
    autoTimeSheetFill: boolean = false;
    remindMeOfTimeSheet: boolean = false;
    timeSheetGen: { startDate: NgbDate, endDate: NgbDate, startD: Date, endD: Date } = {
        startDate: null,
        endDate: null,
        startD: null,
        endD: null
    };
    @BlockUI() blockUI: NgBlockUI;
    // -----------------------------------------------------------------------------------------------------
    orgModelInput = null;
    // Lifecycle Hooks
    private contacts: string[] = [];
    private verticalWizardStepper: Stepper;
    private horizontalWizardStepper: Stepper;

    constructor(private modalService: NgbModal,
        public commonFunctionService:CommonFunctionService,
        private orgService: OrganizationService,
        private toastrService: ToastrService,
        private jobService: JobService,
        private router: Router,
        private contactService: ContactService,
        private authenticationService: AuthenticationService,
        private initialSetupService: EmployeeInitialSetupService,
        private timesheetService: TimesheetService,
    ) {
    }

    private static getDate(ngbDate: NgbDate): Date {
        return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    }

    private static getMonday(d: Date): Date {
        let day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    private static getSunday(d: Date): Date {
        let day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? +6 : 6);// adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    private static getWeeks(start: Date, end: Date) {
        let weeks: { id: number, num: number, startDate: Date, endDate: Date }[] = [];

        while (weeks[weeks.length - 1]?.endDate === undefined || weeks[weeks.length - 1]?.endDate < end) {
            let ed = EmployeeContractorWizardComponent.getSunday(new Date(start));
            let dd = new Date(ed);
            weeks.push({
                id: 0,
                num: weeks.length + 1,
                startDate: EmployeeContractorWizardComponent.getMonday(start),
                endDate: dd
            })
            start = new Date(dd.getTime() + 7 * 24 * 60 * 60 * 1000);
        }
        return weeks;
    }


    /**
     * On init
     */
     loaded= false;
    ngOnInit() {
            this.loaded = true;
        // this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {});
        this.contentHeader = {
            headerTitle: 'Employee Contractor Wizard',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: []
            }
        }
        this.blockUI.start("Fetching State...")
        debugger
        this.loadDefaultOrgConfig();
        this.initialSetupService.getAll().subscribe(value => {
            if (environment.showLogs)
                console.log(value);
                debugger
            if (value?.miscData !== null) {
                this.selected = value.miscData.accountType;
                this.organization = value.miscData.organization;
                this.job = value?.miscData?.job || { jobId: 0 };
                this.timeSheets = value?.miscData?.timeSheets || [];
                this.contact = value?.miscData?.contacts === null ? null : value?.miscData.contacts[0];
            }
            this.blockUI.stop();
        }, error => {
            if (environment.logErrors)
                console.log(error);
            this.blockUI.stop();
        });
    }


    /**
     * Horizontal Wizard Stepper Next
     *
     * @param data
     */
    horizontalWizardStepperNext(data) {
        if (data.form.valid === true) {
            this.horizontalWizardStepper.next();
        }
    }

    /**
     * Horizontal Wizard Stepper Previous
     */
    horizontalWizardStepperPrevious() {
        this.horizontalWizardStepper.previous();
    }

    verticalWizardPrevious() {
        this.verticalWizardStepper.previous();
    }

    verticalWizardNext() {
        this.verticalWizardStepper.next();
    }

    onSubmit() {
        alert('Submitted!!');
        return false;
    }

    loadSteppers() {
        setTimeout(() => {
            if (this.selected === 'employee') {
                this.verticalWizardStepper = new Stepper(document.querySelector('#stepper2'), {
                    linear: false,
                    animation: true
                });
            } else {
                this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {});
            }
        }, 1000);

    }

    onChangeSelected(ele: HTMLDivElement) {
        this.blockUI.start("Saving Selection...");
        this.updateSetupState("AccountType", this.selected, (status, data) => {
            this.blockUI.stop();
            if (status) {
                this.toastrService.success("Account Type Selection Saved!")
                this.scrollToElement(ele);
            } else {
                this.toastrService.error("Unable to Save Selection. Please try Again!")
            }
        });
        // this.loadSteppers();
    }

    showSection(showSectionFor: 'Organization' | 'Job' | 'SendToEmployer' | 'SmartTimeSheet' | 'Reminder' | 'Submit'): boolean {
        switch (showSectionFor) {
            case 'Organization':
                return this.selected !== '' && this.selected !== null && this.selected !== undefined;
            case 'Job':
                return this.organization !== null;
            // case 'TimeSheet':
            //     return this.job !== null && this.job?.id !== 0;
            case 'SendToEmployer':
                return this.job !== null && this.job?.jobId !== 0
            // return this.timeSheets.length > 0 && (this.timeSheets[0].id !== null && this.timeSheets[0].id !== 0);
            case 'SmartTimeSheet':
                return this.contact !== null;
            case 'Reminder':
                return this.contact !== null;
            case 'Submit':
                return this.contact !== null;
        }
        return false;
    }
    organizationId;

    onJobClick(type: string, modalContent) {
        if (type === 'create' || type === 'edit') {
            debugger
            this.job.organization = this.organization;
            this.organizationId=this.organization.organizationId;
            // this.job.email = this.email;
            // this.job.organization = this.organization;

            this.modalService.open(modalContent, {
                centered: true,
                windowClass: 'modal modal-primary'
            });
        }
    }

    onTimeSheetClick(modalContentTG: TemplateRef<any>) {
        this.modalService.open(modalContentTG, {
            centered: true,
            windowClass: 'modal modal-primary'
        });

    }

    getContainerHeight(remCont: HTMLDivElement) {
        return remCont.clientHeight + 'px';
    }

    scrollToElement(element: HTMLDivElement) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",

        });
        // (function smoothscroll() {
        //     var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        //
        //     if (currentScroll > 0) {
        //         window.requestAnimationFrame(smoothscroll);
        //         window.scrollTo(0, currentScroll - currentScroll / element.scrollHeight);
        //     }
        // })();
    }

    onJobDataSubmitted(job: Job, ele: HTMLDivElement, modal: NgbModalRef) {
        this.blockUI.start("Saving Job...")
        let ss = Object.assign({}, job);
        ss.organizationId = this.organization.organizationId;
        delete ss.organization;
        let f = cleanObject(ss);
        if (environment.showLogs)
            console.log(f);

        (this.job !== null && this.job !== undefined && this.job.jobId !== 0 ? this.jobService.update(f as Job) : this.jobService.create(f as Job))
            .subscribe(value => {
                if (environment.showLogs)
                    console.log(value);
                this.job = value.data;
                this.toastrService.success(value.message);
                this.updateSetupState("Job", ss.organizationId, (status, data) => {
                    this.blockUI.stop();
                    modal.dismiss('submit');
                    this.withDelay(() => {
                        this.scrollToElement(ele)
                    });
                })
                if (environment.showLogs)
                    console.log(this.job);
            }, error => {
                if (environment.logErrors)
                    console.error(error);
                this.blockUI.stop()
            });
    }

    onCreateJobClick() {
        this.onCreateJobE.emit();
    }

    withDelay(toDo) {
        setTimeout(() => {
            toDo();
        }, 1000)
    }

    onClickOrganization(orgModelContent) {
        this.orgModelInput = null;
        this.modalService.open(orgModelContent, {
            centered: true,
            windowClass: 'modal modal-primary'
        });
    }

    onSaveOrganizationClick() {
        debugger
      
        this.onCreateOrganization.emit();
       
    }

    onOrganizationSubmitted($organization: any, jobCont: HTMLDivElement, modal: NgbModalRef) {
        this.blockUI.start("Saving Organization...");
        let orgModel = $organization;
        this.job.organization = this.organization;
        // this.job.email = this.organization;
        debugger

        if (orgModel.id > 0) {
        

            this.orgService.updateOrganization(orgModel.id, orgModel).subscribe(
                res => {
                    if (res.successFlag) {
                        this.organization = {};
                        this.organization.organizationId = res.data.organizationId;
                        this.organization.name = res.data.name;
                        this.organization.email = res.data.email;
                        this.organization.website = res.data.website;


                        modal.dismiss('submit');
                        this.updateSetupState("Organization", res.data.organizationId, (status, data) => {
                            this.blockUI.stop();
                            this.scrollToNext(jobCont);
                        })
                    } else {
                        this.blockUI.stop();
                        this.toastrService.error(
                            res.message, 'Error',
                            { toastClass: 'toast ngx-toastr', closeButton: true }
                        );
                    }
                }, error => {
                    this.blockUI.stop();
                }
            );
        } else {
            if(orgModel.isFormValid && orgModel.isFormValid!=undefined){
                this.orgService.createOrganization(orgModel).subscribe(
                    res => {
                        if (res.successFlag) {
                            this.organization = {};
                            this.organization.organizationId = res.data.organizationId;
                            this.organization.name = res.data.name;
                            this.organization.email = res.data.email;
                            this.organization.website = res.data.website;
                            modal.dismiss('submit');
                            this.updateSetupState("Organization", res.data.organizationId, (status, data) => {
                                this.blockUI.stop();
                                this.scrollToNext(jobCont);
                            })
                        } else {
                            this.blockUI.stop();
                            this.toastrService.error(
                                res.message, 'Error',
                                { toastClass: 'toast ngx-toastr', closeButton: true }
                            );
                        }
    
                    }, error => {
                        this.blockUI.stop();
                        this.toastrService.error(
                            "There is problem in setup", 'Error',
                            { toastClass: 'toast ngx-toastr', closeButton: true }
                        );
                    }
                );
            }else{
                this.blockUI.stop();
                this.toastrService.error(
                    "There is problem in setup", 'Error',
                    { toastClass: 'toast ngx-toastr', closeButton: true });
            }
           
        }
        this.blockUI.stop();

    }

    scrollToNext(element) {
        this.withDelay(() => {
            this.scrollToElement(element);
        })
    }

    editOrganization(orgModelContent) {
        debugger
        this.orgModelInput = Object.assign({}, this.organization);
        this.modalService.open(orgModelContent, {
            centered: true,
            windowClass: 'modal modal-primary'
        });
    }

    onSubmitTimeSheetGen(steCont: HTMLDivElement, modal: NgbModalRef) {

        this.timeSheetGen.startD = EmployeeContractorWizardComponent.getDate(this.timeSheetGen.startDate);
        this.timeSheetGen.endD = EmployeeContractorWizardComponent.getDate(this.timeSheetGen.endDate);


        let firstMonday = EmployeeContractorWizardComponent.getMonday(this.timeSheetGen.startD);
        let lastFriday = EmployeeContractorWizardComponent.getSunday(this.timeSheetGen.endD);

        console.log('Monday', firstMonday);
        console.log('Friday', lastFriday);

        let weeks = EmployeeContractorWizardComponent.getWeeks(firstMonday, lastFriday);
        this.timeSheets.splice(0, this.timeSheets.length);
        this.timeSheets.push(...weeks);
        console.log('Weeks', weeks);
        modal.dismiss();
    }

    onAddToContactClick(contactModalContent, isEdit = false) {

        if (isEdit) {
            console.log("On Edit", this.contact);
        }
        this.modalService.open(contactModalContent, {
            centered: true,
            windowClass: 'modal modal-primary',
        });
    }

    onContactSubmitted($event: Contact, modal: NgbModalRef, ...params: HTMLDivElement[]) {
        this.contact = $event as Contact;

        if (environment.showLogs)
            console.log(this.contact);

        if (this.contact.contactId === 0) {
            delete this.contact.contactId;
        }

        delete this.contact.contactType;
        delete this.contact.contactTypeId;

        this.contact.emails[0].type = "Official";
        this.contact.emails[0].email = this.contact.email;

        this.contact.phoneNumbers[0].type = "Official";
        this.contact.phoneNumbers[0].phone = this.contact.phone;

        this.contact.organizationId = this.organization.organizationId;
        this.contact.jobId = this.job.jobId;
        (this.contact?.contactId === 0 || this.contact.contactId === undefined || this.contact.contactId === null ? this.contactService.addContactOnSetup(this.contact) : this.contactService.update(this.contact))
            .subscribe(value => {
                this.updateSetupState("Contacts", this.organization.organizationId,
                    (status, data) => {
                        this.blockUI.stop();
                        
                        modal.dismiss('submit');
                    })
            }, error => {
                if (environment.logErrors)
                    console.log(error);
                this.blockUI.stop();
                modal.dismiss('error');
            })
    }

    onSubmitContactBtn() {
        this.blockUI.start("Saving Contact...")
        this.onCreateContact.emit(true);
    }
    ssList1: EmployeeInitialSetup[] = [];
    ssList: EmployeeInitialSetupListDto;
    onSetupCompletedClick() {
        //TODO: Save Any Changes needs to Be Saved and move to Home Screen.
        // let ss: EmployeeInitialSetup = {};
        //                             ss.status = "Done";
        //                             ss.isCurrent = false;
        //                             ss.orgId = this.tempOrgId;
        //                             ss.section = "GenerateTimesheets";
        //                             ss.screenStatus = "Pending";
        //                             this.initialSetupService.create(ss).subscribe(value => {
        //                                 if (environment.showLogs)
        //                                     console.log(value);
        //                                 // onDone(value.successFlag, value.data);
        //                             }, error => {
        //                                 if (environment.logErrors)
        //                                     console.error(error);
        //                                 // onDone(false, null);
        //                             });

        //fazi code
        debugger
        var getUserInfo = JSON.parse(localStorage.getItem("currentUser"))
        var userId = getUserInfo.userId;
        this.ssList1 = [];

        let ss: EmployeeInitialSetup = {};
        ss.employeeInitialSetupId = 0;
        ss.userId = 0;
        ss.data = null;
        ss.status = "Done";
        ss.isCurrent = false;
        ss.orgId = this.organization.organizationId;
        ss.section = "GenerateTimesheets";
        ss.screenStatus = "Pending";
        ss.userId = userId;
        this.ssList1.push(ss);
        var ssDay: EmployeeInitialSetup = {};
        ssDay.employeeInitialSetupId = 0;
        ssDay.userId = 0;
        ssDay.data = null;
        ssDay.status = "Done";
        ssDay.userId =userId;
        ssDay.isCurrent = false;
        ssDay.orgId = this.organization.organizationId;
        ssDay.section = "Job_Day";
        ssDay.screenStatus = "Pending";

        this.ssList1.push(ssDay);
        //
        var ssDay: EmployeeInitialSetup = {};
        ssDay.employeeInitialSetupId = 0;
        ssDay.userId = 0;
        ssDay.data = null;
        ssDay.status = "Done";
        ssDay.isCurrent = false;
        ssDay.orgId = this.organization.organizationId;
        ssDay.section = "Job_Leave";
        ssDay.userId =userId;
        ssDay.screenStatus = "Pending";

        this.ssList1.push(ssDay);
        //
        var ssDay: EmployeeInitialSetup = {};
        ssDay.employeeInitialSetupId = 0;
        ssDay.userId = 0;
        ssDay.data = null;
        ssDay.status = "Done";
        ssDay.isCurrent = false;
        ssDay.userId =userId;
        ssDay.orgId = this.organization.organizationId;
        ssDay.section = "Job_Salary";
        ssDay.screenStatus = "Pending";

        this.ssList1.push(ssDay);
        //
        var ssDay: EmployeeInitialSetup = {};
        ssDay.employeeInitialSetupId = 0;
        ssDay.userId = 0;
        ssDay.data = null;
        ssDay.status = "Done";
        ssDay.isCurrent = false;
        ssDay.userId =userId;
        ssDay.orgId = this.organization.organizationId;
        ssDay.section = "Job_OverTime";
        ssDay.screenStatus = "Pending";

            this.ssList1.push(ssDay);

        this.initialSetupService.createList(this.ssList1).subscribe(value => {
            if (environment.showLogs)
                console.log(value);
            // onDone(value.successFlag, value.data);
        }, error => {
            if (environment.logErrors)
                console.error(error);
            // onDone(false, null);
        });

        this.blockUI.start("Finishing Setup...")
        this.updateSetupState("SetupCompleted", this.organization.organizationId, (status, data) => {
            this.blockUI.stop();
            //TODO: Instead of Logging out, Need to Re-fetch the User object from the Server and then we'll have to update the local session...
            this.authenticationService.getUserDetails().subscribe(value => {
                this.router.navigate(["/", "home"])
            });
        })
    }

    onTimesheetSaveClick(steCont: HTMLDivElement) {
        let self = this;
        Swal.fire({
            title: 'Generate TimeSheets',
            html: `Are you sure you want to Generate <b>${this.timeSheets.length}</b> Timesheets from StartDate: <b>'${self.timeSheetGen.startD.toLocaleDateString()}'</b> EndDate: <b>${self.timeSheetGen.endD.toLocaleDateString()}</b>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7367F0',
            cancelButtonColor: '#E42728',
            confirmButtonText: 'Yes, Generate them!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary ml-1'
            }
        }).then(function (result) {
            if (result.value) {
                self.blockUI.start("Saving Generated Timesheets...");

                self.timesheetService.create({
                    startDate: self.timeSheetGen.startD.toISOString(),
                    endDate: self.timeSheetGen.endD.toISOString(),
                    jobId: self.job.jobId
                }, true).subscribe(value => {
                    if (environment.showLogs)
                        console.log(value);
                    if (value.successFlag)
                        self.timesheetService.getAll().subscribe(
                            value1 => {
                                if (environment.showLogs)
                                    console.log(value1);
                                if (value.successFlag) {
                                    // self.timeSheets.splice(0, self.timeSheets.length);
                                    self.timeSheets = [...value1.data];
                                    // self.updateSetupState("GenerateTimesheets", self.organization.id, (status, data) => {
                                    //     self.blockUI.stop();
                                    //     Swal.fire({
                                    //         icon: 'success',
                                    //         title: 'TimeSheets Generated!',
                                    //         html: `<b>${value1.data.length}</b> TimeSheets Successfully Generated!`,
                                    //         customClass: {
                                    //             confirmButton: 'btn btn-success'
                                    //         }
                                    //     }).then(value2 => {
                                    //         self.scrollToElement(steCont);
                                    //     });
                                    // })
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'TimeSheets not Generated!',
                                        text: `Couldn't Generate TimeSheets. ${value.message}`,
                                        customClass: {
                                            confirmButton: 'btn btn-success'
                                        }
                                    });
                                    self.blockUI.stop();
                                }
                            },
                            error => {
                                if (environment.logErrors)
                                    console.log(error);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'TimeSheets not Generated!',
                                    text: `Couldn't Generate TimeSheets. Kindly try again or Contact Support.`,
                                    customClass: {
                                        confirmButton: 'btn btn-success'
                                    }
                                });
                                self.blockUI.stop();

                            })
                }, error => {
                    if (environment.logErrors)
                        console.log(error);
                });
            } else {
            }
        });
    }
    OrgizationConfiguzartionLookup : OrgizationConfiguzartionLookup;
    private loadDefaultOrgConfig() {
        debugger
        this.orgService.getDefaultOrganizationConfiguration("Org1").subscribe(value => {
          if (environment.logErrors)
            console.log(value);
          if (value.successFlag) 
          {
              debugger
            // this.OrgizationConfiguzartionLookup = [...value.data];
          }
        })
      }
    private updateSetupState(section: "AccountType" | "Organization" | "Job" | "Contacts" | "SmartTimesheet" | "SetupCompleted", value, onDone: (status: boolean, data: EmployeeInitialSetup) => void) {
        let ss: EmployeeInitialSetup = {};
        ss.status = "Done";
        ss.isCurrent = true;
        this.tempOrgId = value
        if (section === "Job" ||
            section === "Organization" ||
            section === "Contacts" ||
            section === "SmartTimesheet" ||
            section === "SetupCompleted") {
            ss.orgId = value;
        }

        ss.section = section;
        ss.data = `${value}`;
        this.initialSetupService.create(ss).subscribe(value => {
            if (environment.showLogs)
                console.log(value);
            onDone(value.successFlag, value.data);
        }, error => {
            if (environment.logErrors)
                console.error(error);
            onDone(false, null);
        });
    }
}
