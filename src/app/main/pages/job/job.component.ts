import { Component, Input, OnInit, ViewChild } from '@angular/core';
import Stepper from "bs-stepper";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Job, JobDay, JobLeave, JobLeavedetail, JobSalary } from "../../../shared/models/job";
import { AuthenticationService } from "../../../shared/services/authentication.service";
import { AddEditJobComponent } from "../../../shared/components/add-edit-job/add-edit-job.component";
import { JobService } from "../../../shared/services/job.service";
import { environment } from "../../../../environments/environment";
import { Lookup } from "../../../shared/models/lookup";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ToastrService } from "ngx-toastr";
import { EmployeeInitialSetup } from "../../../shared/models/employeeInitialSetup";
import { EmployeeInitialSetupService } from "../../../shared/services/employee-initial-setup.service";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { AddEditSalaryComponent } from 'app/shared/components/add-edit-salary/add-edit-salary.component';
import { AddEditJobDayComponent } from 'app/shared/components/add-edit-job-day/add-edit-job-day.component';
import { Router } from '@angular/router';
import { OrganizationConfigurationDto } from 'app/shared/models/organization';
import { LookupService } from 'app/shared/services/lookup.service';
import { TimesheetService } from 'app/shared/services/timesheet.service';
import { SetupScreenStateDto } from 'app/shared/models/SetupScreenStateDto';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
// import { debug } from 'console';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
    public contentHeader: object
    public firstName = '';

    @ViewChild(AddEditJobComponent) addEditJobComponent: AddEditJobComponent;
    @ViewChild(AddEditSalaryComponent) addEditSalaryComponent: AddEditSalaryComponent;
    @ViewChild(AddEditJobDayComponent) addEditJobDayComponent: AddEditJobDayComponent;
    @Input('JobLeave') JobLeaveModal: JobLeave = { jobLeaveId: 0 };
    pendingItems = [];
    pendingItemList: SetupScreenStateDto[] = [];
    @BlockUI() blockUI: NgBlockUI;

    languages = [{ name: 'World Health Organization' }, { name: 'United Nations' }, { name: 'World Trade Organization' }, { name: 'UNESCO' }, { name: 'UNICEF' }];
    language = '';
    dateOfBirth: any;
    genders = [{ name: 'Male' }, { name: 'Female' }];
    maritalStatuses = [{ name: 'Single' }, { name: 'Married' }, { name: 'Divorced' }];
    maritalStatus: any = 'Single';
    gender: any = '';
    organizationName: any = '';
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
    jobModal: Job = { jobId: 0 };
    jobSalaryModal: JobSalary = { jobSalaryId: 0 };
    organizationConfigurationModal: OrganizationConfigurationDto
    jobSalaryModals: JobSalary[] = [];

    jobDayModal: JobDay[] = [];
    hours: number;
    overtimeRate: number;
    perDayHoursLimit: number;
    isApprovalRequired: boolean;
    nextClicked: boolean = false;


    textFieldMaxLength: number = 25;
    availableJobs: Job[] = [];
    selectedJob: Job;
    salaryType: Lookup;

    overtimeType: Lookup;
    overtimeTypes: Lookup[] = [
        { lookupId: 1, description: 'Hourly' },
        { lookupId: 2, description: 'Monthly' }
    ];
    salary: number;
 
    yearList = [
        {id: 2021, name: '2021', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
        {id: 2022, name: '2022', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15'},
        {id: 2023, name: '2023', avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15'}
    ];
    selectedYear = this.commonFunctionService.getYear().toString();
    // week = {
    //     weekId: 1, days: [
    //         {id: 1, name: 'Monday', startDate: null, endDate: null, isStartingDay: true},
    //         {id: 2, name: 'Tuesday', startDate: null, endDate: null, isStartingDay: false},
    //         {id: 3, name: 'Wednesday', startDate: null, endDate: null, isStartingDay: false},
    //         {id: 4, name: 'Thursday', startDate: null, endDate: null, isStartingDay: false},
    //         {id: 5, name: 'Friday', startDate: null, endDate: null, isStartingDay: false},
    //         {id: 6, name: 'Saturday', startDate: null, endDate: null, isStartingDay: false},
    //         {id: 7, name: 'Sunday', startDate: null, endDate: null, isStartingDay: false},
    //     ]
    // };
    jobLeaves: FormArray = new FormArray([
        // new FormGroup({
        //     description: new FormControl('', [Validators.required]),
        //     hours: new FormControl('', [Validators.required])
        // })
    ]);
    private verticalWizardStepper: Stepper;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastrService: ToastrService,
        public jobService: JobService,
        private initialSetupService: EmployeeInitialSetupService,
        public lookupService: LookupService,
        public tsService: TimesheetService,
        public commonFunctionService: CommonFunctionService,

    ) {
        this.jobModal.organization = this.authenticationService.currentOrganizationValue;

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
                        name: 'job',
                        isLink: false
                    }
                ]
            }
        }
        this.verticalWizardStepper = new Stepper(document.querySelector('#stepper2'), {
            linear: false,
            animation: true
        });



        this.loadShiftTypes();


        this.getPendingSetupsInfo();
    }

    // sortDays(i){
    //     let weeks = [];
    //     weeks.push(this.week.days[i]);

    //    for (let a = i+1; a < this.week.days.length; a++){
    //        if(a != i){
    //            this.week.days[a].isStartingDay = false;
    //            weeks.push(this.week.days[a]);
    //        }
    //    }
    //    for (let a = 0; a < i; a++){
    //        if(a != i){
    //            this.week.days[a].isStartingDay = false;
    //            weeks.push(this.week.days[a]);
    //        }
    //    }
    //     this.week.days = [];
    //     this.week.days = weeks;
    // }

    // getDaysOfWeek(week) {
    //     // return this.daysOfWeek.find(f => f.weekId === week.id)?.days
    //     return this.week.days
    // }

    getJobLeaves() {

        // this.jobLeaves.controls['description'].patchValue('3445454', {onlySelf: true});
        // this.jobLeaves.controls['hours'].patchValue('8', {onlySelf: true});

        return this.jobLeaves.controls as FormGroup[]
    }
    getJobLeaveData(jobModel = null, leaveTypes: Lookup[] = null) {

        console.log(this.JobLeaveModal);
        this.jobService.getJobLeave(this.commonFunctionService.getJobId()).subscribe(res => {
            if (environment.showLogs)
                console.log(res);
            if (res.successFlag) {
                jobModel= res.data;
                if (jobModel !== null) this.JobLeaveModal = jobModel;
                Object.keys(this.JobLeaveModal).forEach(name => {
                    this.addJobLeave();
                    if (this.jobLeaves.controls[name]) {
                        this.jobLeaves.controls[name].patchValue(this.JobLeaveModal[name], { onlySelf: true });
                    }
                });
            }
        }, error => {
            if (environment.logErrors) {
                console.log(error);
            }
        })

      
    }

    addJobLeave() {

        this.jobLeaves.push(
            new FormGroup({
                jobLeaveId: new FormControl(''),
                description: new FormControl('', [Validators.required]),
                hours: new FormControl('', [Validators.required]),
                consumed: new FormControl(''),
                remaining: new FormControl(''),
                comment: new FormControl('')
            })
        );
    }

    

    setDefault(str){
        this.jobLeaves.controls[str].patchValue(this.jobLeaves.controls[str].value, { onlySelf: true });

    }
    resetDeafult(str){
        this.jobLeaves.controls[str].patchValue('', { onlySelf: true });

    }
    removeJobLeave(i) {
        this.jobLeaves.removeAt(i);
    }
    shiftTypes: Lookup[] = [];
    jobLeavedetailList: JobLeavedetail[] = [];

    shiftType: Lookup;
    private loadShiftTypes() {
        // this.lookupService.getTypes("Org", "Shift").
        this.lookupService.getAllByParam("Org", "Shift", "ALL", "0", true, true).subscribe(value => {
            if (environment.logErrors)
                console.log(value);
            if (value.successFlag) {
                this.shiftTypes = [...value.data];
                this.loadAvailableJobs();
            }
        })
    }
    jobLeavedetailNoData:boolean=false;
    loadLeaveDetailByYear() {
        this.loadLeaveDetail(this.commonFunctionService.getJobId(), this.selectedYear);
    }
    
    private loadLeaveDetail(id, year) {
        debugger
        this.jobLeavedetailList = [];
        this.jobService.getPreviosuLeaveDetail(id, year).subscribe(value => {
            if (environment.logErrors)
                console.log(value);
            if (value.successFlag && value.data.length>0) {
                this.jobLeavedetailList = [...value.data];
                this.jobLeavedetailNoData =false;
            }else{
                this.jobLeavedetailNoData =true;
            }

        }, error => {
            if (environment.logErrors)
                console.error(error);
            this.toastrService.error("Error", "Sorry! Some exception has been occured, Please try again later");

        });
    }
    loadAvailableJobs() {

        this.jobService.getAllJob().subscribe(value => {
            if (environment.showLogs) {
                console.log(value);
            }
            // this.jobService.week.days=[];
            this.jobService.IsShowJobError = false;
            this.jobService.jobErrorList = [];

            if (value.successFlag) {
                if (value.data.length > 0) {
                    this.availableJobs = [...value.data];
                    this.jobModal = this.availableJobs[0];

                    if (this.jobModal.jobOvertimeDto) {
                        this.hours = this.jobModal.jobOvertimeDto.hours;
                        this.overtimeRate = this.jobModal.jobOvertimeDto.overtimeRate;
                        this.perDayHoursLimit = this.jobModal.jobOvertimeDto.perDayHoursLimit;
                        this.isApprovalRequired = this.jobModal.jobOvertimeDto.isApprovalRequired;
                        this.overtimeType = this.overtimeTypes.filter(x => x.lookupId == this.jobModal.jobOvertimeDto.overtimeTypeId)[0];

                    }

                }

                // this.jobModal.organization = this.authenticationService.currentOrganizationValue;
                // this.getJobLeaveData(this.availableJobs[0].jobLeaveDtos, null);

                // this.jobDayModal = this.availableJobs[0].jobDayDtos;
                // this.organizationConfigurationModal = this.availableJobs[0].organization.organizationConfigurationDto;

                // this.addEditJobDayComponent.loadJobModalDayDetails(this.jobDayModal, this.organizationConfigurationModal, this.shiftTypes, this.jobModal.shiftId);
                this.jobSalaryModals = this.availableJobs[0].jobSalaryDtos;

                this.jobModal.startDate = this.getNgbDate(new Date(this.jobModal.startDate as string));
                this.jobModal.endDate = this.getNgbDate(new Date(this.jobModal.endDate as string));



                // this.addEditJobComponent.loadJobModalDetails(this.jobModal, this.organizationConfigurationModal);
                // if (this.jobSalaryModals.length > 0) {
                //     this.jobSalaryModal.salaryType = this.salaryTypes.filter(x => x.lookupId == this.jobSalaryModal.salaryTypeId)[0];
                //     // this.addEditSalaryComponent.loadJobModalDetails(this.jobSalaryModals);
                // }


            }
        }, error => {
            if (environment.logErrors) {
                console.log(error);
            }
        })
    }

    getPendingSetupsInfo() {
        this.tsService.getPendingSetups().subscribe(res => {

            console.log(res);
            if (res.successFlag) {
                this.pendingItems = [];
                this.pendingItemList.splice(0, this.pendingItemList.length);
                this.pendingItemList.push(...res.data);
                this.updatePendingInformation(this.pendingItemList);
            }
        });

    }
    IsExitJob(name, status, arr) {

        return arr.some(function (el) {
            return el.section === name && el.screenStatus === status;
        });
    }
    updatePendingInformation(data: SetupScreenStateDto[]) {

        for (let index = 0; index < data.length; index++) {
            if (data[index].section == 'Job' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/job", name: "Job", detail: "Please provide much information about job " }
                this.pendingItems.push(detail);
            }
            // Job day
            if (data[index].section == 'Job_Day' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/job", name: "Job", detail: "Please provide much information about Job Day " }
                this.pendingItems.push(detail);
            }
            // job salary
            if (data[index].section == 'Job_Salary' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/job", name: "Job", detail: "Please provide much information about Job Salary " }
                this.pendingItems.push(detail);
            }
            // job OverTime
            if (data[index].section == 'Job_OverTime' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/job", name: "Job", detail: "Please provide much information about Job OverTime " }
                this.pendingItems.push(detail);
            }
            // job leave 
            if (data[index].section == 'Job_Leave' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/job", name: "Job", detail: "Please provide much information about Job Leave " }
                this.pendingItems.push(detail);
            }

            if (data[index].section == 'Organization' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/org", name: "Organization", detail: "Please provide much information about Organization " }
                this.pendingItems.push(detail);
            }

            if (data[index].section == 'Contacts' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/commons/contacts", name: "Contacts", detail: "Please add proper information for Contacts " }
                this.pendingItems.push(detail);
            }

        }
        if (this.IsExitJob('Job_Day', 'Pending', data)) {
            this.verticalWizardStepper.to(3)
        } else if (this.IsExitJob('Job_Salary', 'Pending', data)) {
            this.verticalWizardStepper.to(2)
        } else if (this.IsExitJob('Job_Leave', 'Pending', data)) {
            this.verticalWizardStepper.to(4)
        } else if (this.IsExitJob('Job_OverTime', 'Pending', data)) {
            this.verticalWizardStepper.to(5)
        } else {
            this.verticalWizardStepper.to(1)
        }

    }
    salaryTypes: Lookup[] = [
        { lookupId: 1, description: 'Hourly' },
        { lookupId: 2, description: 'Monthly' }
    ];
    getDate(ngbDate: NgbDate): Date {
        if (ngbDate != null)
            return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day + 1);
    }
    getNgbDate(date: Date): NgbDate {
        return new NgbDate(date.getUTCFullYear(), date.getMonth() + 1, date.getDate());
    }

    /**
     * Vertical Wizard Stepper Next
     */
    verticalWizardNext(action: 'JobDetails' | 'JobSalary' | 'JobDays' | 'Skip' | 'JobOvertime' | 'JobLeaves') {
        this.nextClicked = false;
        var jobIdObj =this.commonFunctionService.getJobId()

        switch (action) {
            case "JobDetails":

                if (this.addEditJobComponent.jobForm.valid) {
                    this.blockUI.start('Loading...');

                    this.jobModal = this.addEditJobComponent.jobForm.value;
                    // var dt = new Date(this.jobModal.startDate.toLocaleString());
                    this.jobModal.startDate = new Date(this.jobModal.startDate.toLocaleString());
                    if(this.jobModal.endDate!==null){
                        this.jobModal.endDate = new Date(this.jobModal.endDate.toLocaleString());
                    }
                    // if (this.jobModal.startDate > this.jobModal.endDate) {
                    //     this.toastrService.warning("end date not be greater then start date");
                    //     this.blockUI.stop();
                    //     this.addEditJobComponent.jobForm.controls.title.invalid;
                    //     break;
                    // }
                    // var jobId =this.commonFunctionService.getJobId();
                    (this.jobModal !== null && this.jobModal !== undefined && jobIdObj !== 0 ? this.jobService.update(this.jobModal as Job) : this.jobService.create(this.jobModal as Job))
                        .subscribe(value => {
                            if (environment.showLogs)
                                console.log(value);
                            this.blockUI.stop();
                            if (value.successFlag) {
                                this.toastrService.success(value.message);
                                // this.verticalWizardStepper.next();
                                this.jobModal = value.data;
                                //  this.jobModal.organization = this.authenticationService.currentOrganizationValue;
                                //  this.jobModal.organizationId = this.jobModal.organization.id;

                                this.updateSetupState("C_Job", this.jobModal.organizationId, (status, data) => {
                                    this.blockUI.stop();
                                });
                                this.blockUI.stop();
                            } else {
                                this.toastrService.error("Error", value.message);
                                this.blockUI.stop();
                            }
                        }, error => {
                            if (environment.logErrors)
                                console.error(error);
                            this.blockUI.stop();
                            this.toastrService.error("Error", "Sorry! Some exception has been occured, Please try again later");
                            this.blockUI.stop();

                        });
                }
                break;
            case "JobSalary":
                this.blockUI.start('Loading...');

                if (this.jobService.IsShowSalary) {
                    if (this.addEditSalaryComponent.jobSalaryForm.valid) {
                        this.blockUI.start('Loading...');


                        this.jobSalaryModal = this.addEditSalaryComponent.jobSalaryForm.value;
                        this.jobSalaryModal.createdById = 1;

                        this.jobSalaryModal.jobId =jobIdObj;

                        this.jobSalaryModal.ids = this.jobService.salaryDeleteIds;
                        (this.jobSalaryModal !== null && this.jobSalaryModal !== undefined && this.jobSalaryModal.jobSalaryId !== 0 ? this.jobService.createJobSalary(this.jobSalaryModal as JobSalary) : this.jobService.createJobSalary(this.jobSalaryModal as JobSalary))
                            .subscribe(value => {
                                if (environment.showLogs)
                                    console.log(value);
                                if (value.successFlag) {
                                    this.jobService.IsShowSalary= false;

                                    this.toastrService.success(value.message);
                                    // this.verticalWizardStepper.next();
                                    if (this.jobService.jobSalaryList == null)
                                        this.jobService.jobSalaryList = [];
                                    // if(this.jobService.jobSalaryList.fo)
                                    let myDate = new Date();
                                    if (!this.IsExitSalary(value.data.jobSalaryId, this.jobService.jobSalaryList))
                                        this.jobService.jobSalaryList.push({ isActive: true, jobSalaryId: value.data.jobSalaryId, jobId: this.jobSalaryModal.jobId, salaryTypeId: 1, createdDate: myDate, title: this.jobSalaryModal.title, salary: this.jobSalaryModal.salary, salaryType: this.jobSalaryModal.salaryType });
                                    else {
                                        var objIndex = this.jobService.jobSalaryList.findIndex((obj => obj.jobSalaryId == value.data.jobSalaryId));

                                        if (objIndex != -1) {
                                            if (objIndex != undefined) {
                                                this.jobService.jobSalaryList[objIndex].salaryType = this.jobSalaryModal.salaryType;
                                                this.jobService.jobSalaryList[objIndex].title = this.jobSalaryModal.title;
                                                this.jobService.jobSalaryList[objIndex].salary = this.jobSalaryModal.salary;
                                            }
                                        }
                                    }

                                    this.jobService.IsShowTable = true;
                                    this.jobSalaryModal = value.data;
                                    // this.jobService.jobSalaryList?.sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));
                                    // this.jobService.jobSalaryList?.sort((a, b) => b.createdDate - a.createdDate);
                                    this.jobService.jobSalaryList.sort(function(a, b) {
                                        var c = new Date(a.createdDate);
                                        var d = new Date(b.createdDate);
                                        return d.valueOf()-c.valueOf();
                                    });
                                    
                                    this.blockUI.stop();
                                    this.updateSetupState("C_Job", this.jobModal.organizationId, (status, data) => {
                                        this.blockUI.stop();

                                    });
                                } else {
                                    this.toastrService.error("Error", value.message);
                                    this.blockUI.stop();
                                }
                            }, error => {
                                if (environment.logErrors)
                                    console.error(error);
                                this.blockUI.stop();
                                this.toastrService.error("Error", error.message);
                                this.blockUI.stop();

                            });
                    }
                } else {
                    this.toastrService.success('The operation has been completed successfully');
                    this.blockUI.stop();
                    this.verticalWizardStepper.next();
                    this.updateSetupState("C_Job", this.jobModal.organizationId, (status, data) => {
                        this.blockUI.stop();

                    });

                }
                this.blockUI.stop();
                break;
            case "JobDays":
                debugger
                this.blockUI.start('Loading...');
                let days: JobDay[] = [];
                let Totaltime = 0;
                // cehck star Time or end Time
                this.jobService.week.days.forEach(d => {
                    if ((d.startDate == undefined || d.startDate == null) && (d.endDate != undefined || d.endDate != null))
                        d.isStartError = true;
                    else
                        d.isStartError = false;
                    if ((d.startDate != undefined || d.startDate != null) && (d.endDate == undefined || d.endDate == null))
                        d.isEndError = true;
                    else
                        d.isEndError = false;
                });
                //   this.addEditJobDayComponent.loadJobModalDetailsByDate(this.jobService.week.days);

                if (!this.IsExitStartDate(true, this.jobService.week.days) && !this.IsExitEndDate(true, this.jobService.week.days)) {
                    // || !this.IsExitEndDate(true,this.jobService.week.days )
                
                    
                    this.jobService.week.days.forEach(d => {
                        let ed = d.endDate !== null && d.endDate !== '' ? `2019-04-13T${d.endDate}` : d.endDate
                        let sd = d.startDate !== null && d.startDate !== '' ? `2019-04-13T${d.startDate}` : d.startDate
                        days.push({
                            createdById: undefined,
                            createdDate: undefined,
                            dayId: d.id,
                            endTime: ed,
                            jobDayId: undefined,
                            isActive: false,
                            isStartingDay: d.isStartingDay,
                            isWeekendDay: d.isWeekendDay,
                            jobId: jobIdObj,
                            modifiedById: undefined,
                            modifiedDate: undefined,
                            startTime: sd
                        });
                        if (ed != null || sd != null)
                            Totaltime = Totaltime + (Date.parse(ed) - Date.parse(sd));


                    });

                    let seconds = Math.floor(Totaltime / 1000)
                    var minutes = Math.floor(seconds / 60);
                    var hours = Math.floor(minutes / 60);
                    // var days = Math.floor(hours/24);
                    // alert(hours);

                    if (hours < 0 || hours > this.jobModal.hoursPerWeek) {
                        var objIndex = this.jobService.jobErrorList.findIndex((obj => obj.id == 1));
                        if (objIndex == -1) {
                            var data = { name: "you can not add more then " + this.jobModal.hoursPerWeek + " hour's ", id: 1 };
                            this.jobService.jobErrorList.push(data)
                        }
                    } else {
                        this.jobService.createJobDay(days).subscribe(
                            res => {
                                if (res.successFlag) {
                                    this.toastrService.success(res.message);
                                    this.blockUI.stop();
                                    // this.verticalWizardStepper.next();
                                } else {
                                    this.toastrService.error("Error", res.message);
                                    this.blockUI.stop();
                                }
                            },
                            error => {
                                this.toastrService.error("Error", error.message);
                                this.blockUI.stop();
                            }
                        );
                        var objIndex = this.jobService.jobErrorList.findIndex((obj => obj.id == 1));
                        if (objIndex != undefined)
                            this.jobService.jobErrorList.splice(objIndex, 1)
                    }
                    if (this.jobService.jobErrorList != null) {
                        if (this.jobService.jobErrorList.length > 0) {
                            this.jobService.IsShowJobError = true;
                        } else {
                            this.jobService.IsShowJobError = false;
                        }
                    } else {
                        this.jobService.IsShowJobError = false;
                    }
                    this.blockUI.stop();
                } else {
                    this.blockUI.stop();
                }
                this.blockUI.stop();
                break;
            case "JobOvertime":
                this.blockUI.start('Loading...');
                this.jobService.createJobOvertime({
                    createdById: undefined,
                    createdDate: undefined,
                    hours: this.hours,
                    jobOvertimeId: undefined,
                    isActive: undefined,
                    isApprovalRequired: this.isApprovalRequired,
                    jobId: jobIdObj,
                    modifiedById: undefined,
                    modifiedDate: undefined,
                    overtimeRate: this.overtimeRate,
                    overtimeType: undefined,
                    overtimeTypeId: this.overtimeType.lookupId,
                    perDayHoursLimit: this.perDayHoursLimit,
                }).subscribe(
                    res => {
                        console.log("job overtime response", res);
                        if (res.successFlag) {
                            this.toastrService.success(res.message);
                            // this.verticalWizardStepper.next();
                            this.blockUI.stop();
                            // this.router.navigate(["/home"]);
                        } else {
                            this.toastrService.error("Error", res.message);
                            this.blockUI.stop();
                        }
                    }
                    , error => {
                        this.toastrService.error("Error", error.message);
                        this.blockUI.stop();
                    }
                );

                break;
            case "JobLeaves":
                if (this.jobLeaves.valid) {
                    this.blockUI.start('Loading...');
                    let leaves: JobLeave[] = [];


                    this.jobLeaves.value.forEach(l => {

                        leaves.push({
                            createdById: undefined,
                            createdDate: undefined,
                            description: l.description,
                            hours: l.hours,
                            jobLeaveId: l.jobLeaveId == '' || l.jobLeaveId == null ? 0 : l.jobLeaveId,
                            comment: l.comment,
                            consumed: l.Consumed,
                            isActive: false,
                            jobId: jobIdObj,
                            modifiedById: undefined,
                            modifiedDate: undefined
                        });
                    });
                    this.jobService.createJobLeaves(leaves).subscribe(
                        res => {
                            console.log("job leaves response", res);
                            if (res.successFlag) {
                                this.toastrService.success(res.message);
                                this.blockUI.stop();
                                // this.verticalWizardStepper.next();
                            } else {
                                this.toastrService.error("Error", res.message);
                                this.blockUI.stop();
                            }
                        },
                        error => {
                            this.toastrService.error("Error", error.message);
                            this.blockUI.stop();
                        }
                    );
                } else {
                    this.nextClicked = true;
                    return;
                }
                break;
            case "Skip":
                this.blockUI.stop();
                this.verticalWizardStepper.next();
                break;
        }
    }
    sortArr(colName:any){
        this.jobService.jobSalaryList.sort((a,b)=>{
          a= a[colName].toLowerCase();
          b= b[colName].toLowerCase();
          
          return 1;
        });
      }
    /**
     * Vertical Wizard Stepper Previous
     */
    IsExit(name, arr) {
        return arr.some(function (el) {
            return el.jobId === name;
        });
    }
    IsExitSalary(name, arr) {
        return arr.some(function (el) {
            return el.jobSalaryId === name;
        });
    }
    IsExitStartDate(name, arr) {
        return arr.some(function (el) {
            return el.isStartError === name;
        });
    }
    IsExitEndDate(name, arr) {
        return arr.some(function (el) {
            return el.isEndError === name;
        });
    }
    verticalWizardPrevious() {
        this.nextClicked = false;
        this.verticalWizardStepper.previous();
    }
    jobSalaryPage() {
        this.jobService.IsShowSalary= true;
        this.addEditSalaryComponent.ngOnInit();
    }
    jobDetailPage() {
        this.addEditJobComponent.ngOnInit();
    }
    jobDayPage() {
        this.addEditJobDayComponent.ngOnInit();
    }
    jobLeavePage() {
        this.jobLeavedetailNoData=false;
        this.loadJobLeave();
    }
    jobOverTimePage(){
    this.loadJobOverTime();
    }
    loadJobOverTime(){
        this.hours = 0;
        this.overtimeRate = 0;
        this.perDayHoursLimit = 0;
        this.isApprovalRequired = false;

        this.jobService.getJobOverTime(this.commonFunctionService.getJobId()).subscribe(res => {
            if (environment.showLogs)
                console.log(res);
                debugger
            if (res.successFlag && res.data!=null) {
                this.hours = res.data.hours;
                this.overtimeRate = res.data.overtimeRate;
                this.perDayHoursLimit = res.data.perDayHoursLimit;
                this.isApprovalRequired = res.data.isApprovalRequired;
                this.overtimeType = this.overtimeTypes.filter(x => x.lookupId == res.data.overtimeTypeId)[0];
            
            }
        }, error => {
            if (environment.logErrors) {
                console.log(error);
            }
        })
    }

    resetHour(){
        this.hours = null;
     
    }
    resetOvertimeRate(){
        this.overtimeRate = null;
    }
    resetPerDayHoursLimit(){
        this.perDayHoursLimit = null;
    }
   
    loadJobLeave() {
        this.selectedYear = this.commonFunctionService.getYear().toString();
        this.jobLeaves.clear();
       this.getJobLeaveData();
    }

    invalid() {
        this.nextClicked = true;
    }

    onSubmit() {
        alert('Submitted!!');
        return false;
    }

    newJob(term: any) {
        return new Promise((resolve) => {
            resolve({ id: 0, title: term, tag: true });
        })
    }


    private updateSetupState(section: "C_AccountType" | "C_Organization" | "C_Job" | "C_GenerateTimesheets" | "C_Contacts" | "C_SmartTimesheet"
        | "C_SetupCompleted" | "Job_Day" | "Job_Salary" | "Job_OverTime" | "Job_Leave", value, onDone: (status: boolean, data: EmployeeInitialSetup) => void) {
        let ss: EmployeeInitialSetup = {};
        ss.status = "Done";
        ss.isCurrent = true;

        if (section === "C_Job" ||
            section === "C_Organization" ||
            section === "C_GenerateTimesheets" ||
            section === "C_Contacts" ||
            section === "C_SmartTimesheet" ||
            section === "Job_Day" ||
            section === "Job_Salary" ||
            section === "Job_OverTime" ||
            section === "Job_Leave" ||
            section === "C_SetupCompleted") {
            ss.orgId = value;
        }
        ss.screenStatus = "Completed";
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
    // JOb Start Year
    goTo(){
        this.router.navigate(["/home"]);
    }
}
