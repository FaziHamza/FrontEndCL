import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core'
import { TimesheetService } from "../../shared/services/timesheet.service";
import { HoursWorked, SampleTimeSheet } from "../../shared/models/sampleTimeSheet";
import { NgbCalendar, NgbDate, NgbDateStruct, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Organization } from "../../shared/models/organization";
import { OrganizationService } from "../../shared/services/organization.service";
import { environment } from "../../../environments/environment";
import { AuthenticationService } from "../../shared/services/authentication.service";
import { Router } from "@angular/router";
import { JobDto, TimeSheetDetail } from 'app/shared/models/timeSheetDetail';
import { SetupScreenStateDto } from 'app/shared/models/SetupScreenStateDto';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import Swal from "sweetalert2";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Job, JobLeavedetail } from 'app/shared/models/job';
import { EmployeeInitialSetup } from 'app/shared/models/employeeInitialSetup';
import { JobService } from 'app/shared/services/job.service';
import { EmployeeInitialSetupService } from 'app/shared/services/employee-initial-setup.service';
import { ToastrService } from 'ngx-toastr';
import { timeInOutDto } from 'app/shared/models/timesheet';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { ErrorPopupComponent } from '../shared/commons/error-popup/error-popup.component';

const left = [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
    group([
        query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
            optional: true,
        }),
        query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))], {
            optional: true,
        }),
    ]),
];

const right = [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
    group([
        query(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
            optional: true,
        }),
        query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(-100%)' }))], {
            optional: true,
        }),
    ]),
];
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        trigger('animSlider', [
            transition(':increment', right),
            transition(':decrement', left),
        ]),
    ],
})
export class HomeComponent implements OnInit {

    timeSheetGen: { startDate: Date, endDate: Date, startD: Date, endD: Date } = {
        startDate: null,
        endDate: null,
        startD: null,
        endD: null
    };
    jobId?: number;
    sDate?: Date;
    enDate?: Date;
    nextWeekFormart: string = "-"
    timeSheets: any[] = [];
    job: Job = { jobId: 0 };
    @BlockUI() blockUI: NgBlockUI;
    organizations: Organization[] =
        [];
    timeSheetDetail: TimeSheetDetail[] = [];
    pendingItemList: SetupScreenStateDto[] = [];
    timeInOutDtoList: timeInOutDto[] = [];

    selectedOrganization = 0;
    tempOrgId: number = 0;;
    dayId: number = 1;
    ngbModalRef: NgbModalRef;
    sortDir = 1;//1= 'ASE' -1= DSC
    public contentHeader: object
    organization: Organization;

    isTimeInActive: boolean = false;
    isTimeOutActive: boolean = false;

    isBreakInActive: boolean = false;
    isBreakOutActive: boolean = false;



    constructor(private ref: ChangeDetectorRef, public tsService: TimesheetService, public orgService: OrganizationService,
        private authenticationService: AuthenticationService,
        private router: Router, private modalService: NgbModal, private timesheetService: TimesheetService, public toastrService: ToastrService
        , private jobService: JobService, private initialSetupService: EmployeeInitialSetupService
        , private calendar: NgbCalendar, public commonFunctionService: CommonFunctionService
    ) {


    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    // get organization() {
    //     debugger
    //     var currentOrgaizations = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' || localStorage.getItem("currentOrgaization")==null ? null : localStorage.getItem("currentOrgaization"));
    //     if (currentOrgaizations != null)
    //         if (currentOrgaizations.organizationId != 0)
    //             return this.organizations.find(f => f.organizationId === currentOrgaizations.organizationId);
    //         else {

    //             return this.organizations[0];
    //         }
    //         this.tempOrgId =this.organizations[0].organizationId;
    //     return this.organizations[0];
    // }

    // get availableTimeSheets() {
    //     return this.tsService.availableTimeSheets;
    // }

    get dataAll() {

        return this.tsService.getTimeSheet();
    }

    /**
     * On init
     */


    resetData() {
        this.tsService.counter = 0;
        this.tsService.counter = 0;
        this.tsService.link = '0';
        this.tsService.txt = '';
        this.tsService.isTimeSheetAdded = 0;
        this.tsService.pendingItems.length = 0;
        this.tsService.pendingItems = [];
    }
    ngOnInit() {

        this.contentHeader = {
            headerTitle: 'Home',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'Home',
                        isLink: true,
                        link: '/'
                    },
                    {
                        name: 'Sample',
                        isLink: false
                    }
                ]
            }
        }


        this.organizations = null// JSON.parse(localStorage.getItem("allOrgaizations"));
        // this.selectedOrganization = this.authenticationService?.currentOrganizationValue?.id
        //     || this.authenticationService?.currentUserValue?.organizationId
        //     || 0;
        //TODO: Probably should Implement Subscription here
        // if(this.selectedOrganization==0)
        this.resetData();
        if (this.organizations == null) {
            this.organizations = [];
            this.orgService.getAllOrganizations().subscribe(value => {
                if (environment.showLogs) {
                    console.log(value);
                }
                if (value.successFlag) {
                    this.organizations.push(...value.data);
                    // localStorage.setItem("allOrgaizations", JSON.stringify(this.organizations));
                    // this.authenticationService.organizationSubject.next(this.organization);
                    // is we need to do like this?
                    this.authenticationService.organizationSubject?.subscribe(value => {
                        debugger
                        if (value == null) {

                            this.organization = this.organizations[0];
                            // this.tempOrgId = this.organization.organizationId;

                        } else {
                            console.log(value);
                            this.organization = value;
                            // this.tempOrgId = this.organization.organizationId;
                        }
                        localStorage.setItem("currentOrgaization", JSON.stringify(this.organization));
                        // get organization() {
                        //     debugger
                        //     var currentOrgaizations = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' || localStorage.getItem("currentOrgaization")==null ? null : localStorage.getItem("currentOrgaization"));
                        //     if (currentOrgaizations != null)
                        //         if (currentOrgaizations.organizationId != 0)
                        //             return this.organizations.find(f => f.organizationId === currentOrgaizations.organizationId);
                        //         else {

                        //             return this.organizations[0];
                        //         }
                        //         this.tempOrgId =this.organizations[0].organizationId;
                        //     return this.organizations[0];
                        // }



                    })
                    this.authenticationService.organizationSubject.next(this.organization);

                    this.getTimeSheetInfo();
                    this.getPendingSetupsInfo();
                    this.getJobInInfo();

                }
            }, error => {
                if (environment.logErrors) {
                    console.log(error);
                }
            })
        }
        else {
            this.authenticationService.organizationSubject.next(this.organization);
            this.getTimeSheetInfo();
            this.getPendingSetupsInfo();
            this.getJobInInfo();

        }
        // this.updatecode(data);


    }
    // sort 

    onSortClick(event) {
        debugger
        let target = event.currentTarget,
            classList = target.classList;

        if (classList.contains('icon-arrow-up')) {
            classList.remove('icon-arrow-up');
            classList.add('icon-arrow-down');
            this.sortDir = -1;
        } else {
            classList.add('icon-arrow-up');
            classList.remove('icon-arrow-down');
            this.sortDir = 1;
        }
        this.sortArr('startDate');
    }
    sortArr(colName: any) {
        this.timeSheetDetail.sort((a, b) => {
            a = a[colName].toLowerCase();
            b = b[colName].toLowerCase();

            return this.sortDir;
        });
        // this.timeSheetDetail.sort((a,b) => a.id.toString().localeCompare(b.id.toString()));
        // this.timeSheetDetail.sort((a,b) => (a.endDate.toString() > b.endDate.toString()) ? 1 : ((b.endDate.toString() > a.endDate.toString()) ? -1 : 0));

        console.log(this.timeSheetDetail)
    }


    saveClockTime(status) {

        var jobLeaveId = 0;
        if(status=="Leave Out" || status=='Leave In'){
            jobLeaveId = this.tsService.selectedLeaveObj.jobLeaveId;
        }
        var dt = new timeInOutDto();

        this.blockUI.start(environment.blockUIMessage);

        this.commonFunctionService.getSytemInfo().subscribe(res => {
            debugger
            if (res) {
                dt = res;
                dt.jobLeaveId =jobLeaveId;
                dt.status = status;
                dt.countryCode = res.country_code;
                dt.countryName = res.country_name;
                dt.jobId = this.jobId;
                dt.isAddedTimeSheetDetail = true;
                var osName = "Unknown";
                if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) osName = "Windows 10";
                dt.os = osName;
                dt.browser = this.commonFunctionService.getBrowser().name;
                
                this.tsService.saveClockTime(dt).subscribe(res => {
                    if (res.successFlag) {
                        this.toastrService.success(res.message);
                        this.tsService.isLocalLeave = false;
                        this.blockUI.stop();

                    } else {
                        this.blockUI.stop();

                        this.toastrService.error("Error", res.message);
                    }
                }, error => {
                    this.blockUI.stop();
                    if (environment.logErrors) {
                        this.toastrService.error("Error", environment.errorMessage);
                    }
                })
            }
        }, error => {
            this.blockUI.stop();
            if (environment.logErrors) {
                this.toastrService.error("Error", environment.errorMessage);
            }
        })

    }

    modalOpenLeaveHourly(steCont: HTMLDivElement, modal: any, status:string) {
        console.log("dss")
        var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
        //     debugger
        //     if(this.tsService.dailyActivityForm.length>0)
        //     {
        //      var latestId =  this.tsService.dailyActivityForm.at(this.tsService.dailyActivityForm.length-1).get('activityTypeId').value;
        //      if(latestId===61){
        //        var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
        //        if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {
        //          if(this.tsService.jobLeavedetailList.length==0 || this.tsService.jobLeavedetailList ==null ){
        //        this.loadLeaveDetail(currentOrgaization.jobDto.jobId,this.detailId,this.commonFunctionService.getYear());
        //        }}
        //        this.modalService.open(steCont, {
        //          centered: true,
        //          size: 'md'
        //        });
        //      }else if(latestId!==57){
        //        this.toastrService.info("Time Out","Please timout first")
        //      }
        //      else
        //      {
        //        var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
        //        if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {
        //          if(this.tsService.jobLeavedetailList.length==0 || this.tsService.jobLeavedetailList ==null ){
        //          this.loadLeaveDetail(currentOrgaization.jobDto.jobId,this.detailId,this.commonFunctionService.getYear());
        //        }
        //      }
        //        this.modalService.open(steCont, {
        //          centered: true,
        //          size: 'md'
        //        });
        //      }
        //    }else
        //    {
        //      var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
        //      if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {
        //        if(this.tsService.jobLeavedetailList.length==0 || this.tsService.jobLeavedetailList ==null ){
        //        this.loadLeaveDetail(currentOrgaization.jobDto.jobId,this.detailId,this.commonFunctionService.getYear());
        //      }
        //    }
        //      this.modalService.open(steCont, {
        //        centered: true,
        //        size: 'md'
        //      });
        //    }

        this.loadLeaveDetail(currentOrgaization.jobDto.jobId, 0, this.commonFunctionService.getYear());
        this.modalService.open(steCont, {
            centered: true,
            size: 'md'
        });
        // alert("wlcom")
    }
    private loadLeaveDetail(id, timeSheetId, year) {
        this.tsService.jobLeavedetailList = [];
        this.jobService.getLeaveDetailByTimeSheet(id, timeSheetId, year).subscribe(value => {
            if (environment.logErrors)
                console.log(value);
            if (value.successFlag) {
                this.tsService.jobLeavedetailList = [...value.data];
                // this.tsService.calculateLeave();
            }
        })
    }

    changeTableRowColor(idx: any, data: JobLeavedetail) {
        if (this.tsService.jobLeavedetailList.length > 0) {
          debugger
          if (data.totalHours - data.totalConsummedHours <= 0) {
    
          } else {
            console.log(data);
            this.tsService.selectedLeaveObj = data;
    
            // this.tsService.leaveLabel='';
            // this.tsService.leaveLabel =data.description+'';
            if (this.tsService.selectRowClicked === idx) this.tsService.selectRowClicked = -1;
            else this.tsService.selectRowClicked = idx;
          }
        }
    
      }

    //Time Sheet Code
    onTimeSheetClick(modalContentTG: TemplateRef<any>) {
        this.modalService.open(modalContentTG, {
            centered: true,
            windowClass: 'modal modal-primary'
        });
    }
    // genarte TimeSheet 
    onSubmitTimeSheetGen(steCont: HTMLDivElement, modal: NgbModalRef) {

        // this.timeSheetGen.startD = EmployeeContractorWizardComponent.getDate(this.timeSheetGen.startDate);
        // this.timeSheetGen.endD = EmployeeContractorWizardComponent.getDate(this.timeSheetGen.endDate);


        // let firstMonday = EmployeeContractorWizardComponent.getMonday(this.timeSheetGen.startD);
        // let lastFriday = EmployeeContractorWizardComponent.getSunday(this.timeSheetGen.endD);

        // console.log('Monday', firstMonday);
        // console.log('Friday', lastFriday);

        // let weeks = EmployeeContractorWizardComponent.getWeeks(firstMonday, lastFriday);
        // this.timeSheets.splice(0, this.timeSheets.length);
        // this.timeSheets.push(...weeks);
        // console.log('Weeks', weeks);
        this.onTimesheetSaveClick(steCont, modal);
        modal.dismiss();
    }
    private static getDate(ngbDate: NgbDate): Date {
        return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    }
    private static setDate(ngbDate: Date): Date {
        return new Date(ngbDate.getFullYear(), ngbDate.getMonth() - 1, ngbDate.getDay());
    }
    // // finally time sheet
    onTimesheetSaveClick(steCont: HTMLDivElement, modal: NgbModalRef) {

        if (this.timeSheetGen.startDate != null && this.timeSheetGen.endDate != null) {
            let id = this.jobId;
            debugger
            this.timeSheetGen.startD = new Date(this.timeSheetGen.startDate);
            this.timeSheetGen.endD = new Date(this.timeSheetGen.endDate);


            let self = this;
            this.genrateTimeSheet(null, steCont, self, id, this.timeSheetGen.startD, this.timeSheetGen.endD, modal)
        }
    }

    onNextWeekSaveClick(steCont: HTMLDivElement, modal: NgbModalRef) {
        debugger
        let id = this.jobId;
        this.timeSheetGen.startD = this.sDate;
        this.timeSheetGen.endD = this.enDate;
        let self = this;
        this.genrateTimeSheet('week', steCont, self, id, this.timeSheetGen.startD, this.timeSheetGen.endD, modal)
    }
    private genrateTimeSheet(txt, steCont, self, id, startD, endD, modal: NgbModalRef) {

        Swal.fire({
            title: 'Generate TimeSheets',
            html: `Are you sure you want to Generate` + txt == null ? "" : "Next week from (" + this.nextWeekFormart + ") Time Sheet",
            // html: `Are you sure you want to Generate <b>${this.timeSheets.length}</b> Timesheets from StartDate: <b>'${self.timeSheetGen.startD.toLocaleDateString()}'</b> EndDate: <b>${self.timeSheetGen.endD.toLocaleDateString()}</b>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7367F0',
            cancelButtonColor: '#E42728',
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary ml-1'
            }
        }).then(function (result) {
            if (result.value) {
                self.blockUI.start("Saving Generated Timesheets...");
                debugger
                var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
                var startD1 = (new Date(startD - tzoffset)).toISOString().slice(0, -1);
                var endD1 = (new Date(endD - tzoffset)).toISOString().slice(0, -1);

                self.timesheetService.create({
                    startDate: startD1,
                    endDate: endD1,
                    jobId: id,
                }, true).subscribe(value => {
                    if (environment.showLogs)
                        console.log(value);
                    if (value.successFlag)

                        if (txt == null) {
                            modal.dismiss();
                            self.tsService.isTimeSheetAdded == 0;
                            let ss: EmployeeInitialSetup = {};
                            ss.status = "Done";
                            ss.isCurrent = false;
                            ss.orgId = self.organization.organizationId;
                            ss.section = "GenerateTimesheets";
                            ss.screenStatus = "Completed";
                            self.initialSetupService.create(ss).subscribe(value => {
                                if (environment.showLogs)
                                    console.log(value);
                                // onDone(value.successFlag, value.data);
                                debugger
                                self.resetData();
                                self.tsService.pendingItems = [];
                                self.getPendingSetupsInfo();
                                self.getTimeSheetInfo();

                                self.tsService.isTimeSheetAdded = 0;
                                self.blockUI.stop();
                                self.ref.detectChanges();
                            }, error => {
                                if (environment.logErrors)
                                    console.error(error);
                                // onDone(false, null);
                            });
                        } else {

                            self.getTimeSheetInfo();
                            self.blockUI.stop();
                        }


                }, error => {
                    self.blockUI.stop();
                    if (environment.logErrors)
                        console.log(error);
                });
            } else {
                self.blockUI.stop();
            }
        });


    }
    private updateSetupState(section: "AccountType" | "Organization" | "Job" | "GenerateTimesheets" | "Contacts" | "SmartTimesheet" | "SetupCompleted", value, onDone: (status: boolean, data: EmployeeInitialSetup) => void) {
        let ss: EmployeeInitialSetup = {};
        ss.status = "Done";
        ss.isCurrent = true;

        if (section === "Job" ||
            section === "Organization" ||
            section === "GenerateTimesheets" ||
            section === "Contacts" ||
            section === "SmartTimesheet" ||
            section === "SetupCompleted") {
            ss.orgId = value;
        }

        ss.section = section;
        ss.data = `${value}`;
        //   Is we need to udpate db
        // this.initialSetupService.create(ss).subscribe(value => {
        //     if (environment.showLogs)
        //         console.log(value);
        //     onDone(value.successFlag, value.data);
        // }, error => {
        //     if (environment.logErrors)
        //         console.error(error);
        //     onDone(false, null);
        // });
    }
    scrollToElement(element: HTMLDivElement) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",

        });
    }
    // end Time sheet code
    fromModel(date: Date): NgbDateStruct {
        return date ? {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate()
        } : null;
    }
    getTimeSheetInfo() {
        this.tsService.getTimeSheet().subscribe(res => {

            console.log(res);
            this.timeSheetDetail = [];
            this.tsService.weekNames = [];
            if (res.successFlag && res.data.length > 0) {
                // this.timeSheetGen.startDate =this.calendar.getToday();//HomeComponent.setDate(new Date(res.data[0].endDate));
                var date = new Date();
                var ngbDateStruct = { day: date.getUTCDay(), month: date.getUTCMonth(), year: date.getUTCFullYear() };

                // this.timeSheetGen.startDate = this.calendar.getMonths('2021')  (HomeComponent.setDate(new Date(res.data[0].endDate)));
                // this.timeSheetGen.endDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);//HomeComponent.setDate(new Date(res.data[0].endDate));
                this.timeSheetDetail.splice(0, this.timeSheetDetail.length);

                let nextweek = new Date(res.data[0].endDate);
                this.nextWeekFormart = new Date(nextweek.setDate(nextweek.getDate() + 1)).toLocaleDateString() + "to " + new Date(nextweek.setDate(nextweek.getDate() + 6)).toLocaleDateString();


                this.sDate = null;
                this.enDate = null;
                debugger
                let numWeeks = 1;
                let now = new Date(res.data[0].endDate);
                this.sDate = new Date(now.setDate(now.getDate() + 6));
                this.enDate = new Date(now.setDate(this.sDate.getDate() + numWeeks * 1));
                var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' || localStorage.getItem("currentOrgaization") == null ? null : localStorage.getItem("currentOrgaization"));
                if (currentOrgaization != null)
                // currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null
                {

                    var orgConfigration = this.organizations.filter(x => x.organizationId == currentOrgaization.organizationId)[0].jobDto;

                    this.job = orgConfigration;
                    if (orgConfigration.jobDayDtos != null) {
                        var jobDay = orgConfigration.jobDayDtos.filter(x => x.isStartingDay == true)[0];
                        this.dayId = jobDay.dayId == 0 || jobDay.dayId == null ? 0 : jobDay.dayId;
                    }
                }
                debugger
                res.data.forEach(ele => {

                    if (ele.timeSheetDailyActivityDtos != null) {
                        for (let i = ele.timeSheetDailyActivityDtos.length; i <= 6; i++) {
                            ele.timeSheetDailyActivityDtos.push({ timeSheetDailyActivityId: 0, hours: null, dayId: i, earning: 0, expense: 0 });
                        }
                        debugger
                        ele.timeSheetStatus = ele.timeSheetStatus;
                        ele.hours = Number((ele.timeSheetDailyActivityDtos.map(item => item.hours).reduce((prev, next) => prev + next)).toFixed(2));
                        ele.expenseAmount = ele.timeSheetDailyActivityDtos.map(item => item.expense).reduce((prev, next) => prev + next);
                        ele.payAmount = ele.timeSheetDailyActivityDtos.map(item => item.earning).reduce((prev, next) => prev + next);
                    } else {
                        ele.timeSheetDailyActivityDtos = [];
                        for (let i = 0; i <= 6; i++) {
                            ele.timeSheetDailyActivityDtos.push({ timeSheetDailyActivityId: 0, hours: null, dayId: i, earning: 0, expense: 0 });
                        }
                        ele.hours = 0;
                        ele.expenseAmount = 0;
                        ele.payAmount = 0;
                    }
                })
                // this.sortDays(this.dayId == null || this.dayId == 0 ? 1 : this.dayId - 1);
                // this.sortDays(2-1);
                debugger
                this.timeSheetDetail.push(...res.data)
                // this.sortArr('startDate');
            }
        });

    }
    getJobInInfo() {
        debugger
        if (this.organization.jobDto != null)
            this.jobId = this.organization.jobDto.jobId;
        this.tempOrgId = this.organization.organizationId;
        var currentOrgaization = this.organizations.find(f => f.organizationId === this.tempOrgId);
        this.organization = currentOrgaization;
        localStorage.setItem("currentOrgaization", JSON.stringify(currentOrgaization));
        // this.jobService.getJobByOrgId(this.organization.id).subscribe(res => {
        //     
        //     console.log(res);
        //     this.job = null;
        //     if (res.successFlag && res.data.length > 0) {
        //         this.jobId = res.data[0].Id;
        //     }
        // });

    }
    sortDays(i) {

        let weeks = [];

        weeks.push(this.week.days[i]);
        for (let a = i + 1; a < 7; a++) {
            if (a != i) {
                this.week.days[a].isStartingDay = false;
                weeks.push(this.week.days[a]);
            }
        }
        for (let a = 0; a < i; a++) {
            if (a != i) {
                this.week.days[a].isStartingDay = false;
                weeks.push(this.week.days[a]);
            }
        }
        this.week.days = [];
        this.week.days = weeks;
    }
    week = {
        weekId: 1,
        days: [
            { dayId: 1, id: 1, name: 'M', startDate: null, endDate: null, isStartingDay: true },
            { dayId: 2, id: 2, name: 'T', startDate: null, endDate: null, isStartingDay: false },
            { dayId: 3, id: 3, name: 'W', startDate: null, endDate: null, isStartingDay: false },
            { dayId: 4, id: 4, name: 'T', startDate: null, endDate: null, isStartingDay: false },
            { dayId: 5, id: 5, name: 'F', startDate: null, endDate: null, isStartingDay: false },
            { dayId: 6, id: 6, name: 'S', startDate: null, endDate: null, isStartingDay: false },
            { dayId: 7, id: 7, name: 'S', startDate: null, endDate: null, isStartingDay: false },
        ]
    };
    getPendingSetupsInfo() {
        debugger
        this.tsService.getPendingSetups().subscribe(res => {

            console.log(res);
            if (res.successFlag) {
                this.tsService.pendingItems = [];
                this.pendingItemList.splice(0, this.pendingItemList.length);
                this.pendingItemList.push(...res.data);
                this.tsService.updatePendingInformation(this.pendingItemList);
            }
        });

    }
    geTimeInOutStatus() {
        debugger
        this.tsService.geTimeInOutStatus().subscribe(res => {

            console.log(res);
            if (res.successFlag) {
                this.timeInOutDtoList.splice(0, this.pendingItemList.length);
                this.timeInOutDtoList.push(...res.data);

            }
        });

    }
    getStatusOfDay(tw: HoursWorked): string {
        return tw.isAbsent ? "You were absent this day." :
            (tw.isLeave ? "You were on Leave this day." :
                (tw.isOvertime ? `You worked ${tw.hours} hours this day. This includes your overtime hours as well.` :
                    `You worked ${tw.hours} hours this day.`));
    }
    getWeekHours(hoursWorked: any): number {

        switch ((typeof hoursWorked === 'number' ? hoursWorked : hoursWorked.day)) {
            case 1:
                return hoursWorked.hours;
            case 2:
                return hoursWorked.hours;
            case 3:
                return hoursWorked.hours;
            case 4:
                return hoursWorked.hours;
            case 5:
                return hoursWorked.hours
            case 6:
                return hoursWorked.hours;
            case 7:
                return hoursWorked.hours;
            default:
                return 0;
        }
    }

    onSelectOrganization(modelContent: any) {
        // this.tempOrgId = this.selectedOrganization;
        this.ngbModalRef = this.modalService.open(modelContent, { centered: true });
    }

    onSubmitSearchCreateOrganization() {
        debugger
        this.resetData();
        this.selectedOrganization = this.tempOrgId;
        this.tempOrgId = this.selectedOrganization;
        var currentOrgaization = this.organizations.find(f => f.organizationId === this.tempOrgId);
        this.organization = currentOrgaization;
        localStorage.setItem("currentOrgaization", JSON.stringify(currentOrgaization));
        this.ngbModalRef.close();
        this.authenticationService.organizationSubject.next(this.organization);
        this.getPendingSetupsInfo();

        this.getTimeSheetInfo();
        this.getJobInInfo();
    }

    onChangeOrganization(id: number, input: HTMLInputElement) {
        console.log(this.tempOrgId, id);
        this.tempOrgId = id;
        if (!input.checked) {
            input.checked = true;
        }

    }

    onClickOrganization() {
        this.router.navigate(["/pages/org"]);
    }
    goTo(tsId, detailId, dayId) {
        this.router.navigate(['/timesheet/daily-activity/', tsId, detailId, dayId])
    }

    open() {
        const modalRef = this.modalService.open(ErrorPopupComponent);
        modalRef.componentInstance.title = 'Error';
        modalRef.componentInstance.content = environment.errorMessage;
      }
}



