import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Job, JobLeavedetail } from 'app/shared/models/job';
import { Organization } from 'app/shared/models/organization';
import { TimeSheetDetail } from 'app/shared/models/timeSheetDetail';
import { AuthenticationService } from 'app/shared/services/authentication.service';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { OrganizationService } from 'app/shared/services/organization.service';
import { TimesheetService } from 'app/shared/services/timesheet.service';
import { environment } from 'environments/environment';
import { DragulaService } from "ng2-dragula";
import { SampleTimeSheet } from "../../../../shared/models/sampleTimeSheet";
import Swal from "sweetalert2";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from 'app/shared/services/job.service';

@Component({
    selector: 'app-timesheet-dashboard',
    templateUrl: './timesheet-dashboard.component.html',
    styleUrls: ['./timesheet-dashboard.component.scss']
})
export class TimesheetDashboardComponent implements OnInit, OnDestroy {

    availableTimeSheets: SampleTimeSheet[] = [
        {
            id: 1,
            week: '1',
            date: '2021-08-24T10:48:10Z',
            allowOvertime: true,
            status: 'Done',
            emails: ['samuel@gmail.com', 'someoneElse@gmail.com']
        },
        {
            id: 2,
            week: '2',
            date: '2021-08-24T10:48:10Z',
            allowOvertime: false,
            status: 'Rejected',
            emails: ['samuel@gmail.com', 'someoneElse@gmail.com']
        },
        {
            id: 3,
            week: '3',
            date: '2021-08-24T10:48:10Z',
            allowOvertime: true,
            status: 'In-Progress',
            emails: ['samuel@gmail.com', 'someoneElse@gmail.com']
        },
    ];
    jobLeavedetailList: JobLeavedetail[] = [];
    @BlockUI() blockUI: NgBlockUI;
    isHourly :boolean=false;
    timeSheetDetailPending: TimeSheetDetail[] = [];
    sentTimeSheets: TimeSheetDetail[] = [];
    approvedTimeSheets: TimeSheetDetail[] = [];
    ngbModalRef: NgbModalRef;
    constructor(private dragulaService: DragulaService,
        public commonFunctionService: CommonFunctionService,
        private authenticationService: AuthenticationService, public jobService: JobService, public orgService: OrganizationService, public tsService: TimesheetService,
        private route: ActivatedRoute
        , private modalService: NgbModal,
        private routerNavigate: Router,
    ) {
        // dragulaService.createGroup('multiple-list-group', {
        //     moves: function (el, container, handle) {
        //
        //         console.log('Moves', el, container, handle);
        //
        //         return true;
        //     }
        // });

    }
    dayId: number = 0;
    organizations: Organization[] =
        [];
    job: Job = { jobId: 0 };
    get organization() {

        var currentOrgaizations = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
        if (currentOrgaizations != null)
            if (currentOrgaizations.organizationId != 0)
                return this.organizations.find(f => f.organizationId === currentOrgaizations.organizationId);
            else {

                return this.organizations[0];
            }
        return this.organizations[0];
    }

    ngOnInit() {

        if (this.organizations == null || this.organizations.length == 0) {
            this.organizations = [];
            this.orgService.getAllOrganizations().subscribe(value => {
                if (environment.showLogs) {
                    console.log(value);
                }
                if (value.successFlag) {
                    this.organizations.push(...value.data);
                    // localStorage.setItem("allOrgaizations", JSON.stringify(this.organizations));
                    this.authenticationService.organizationSubject.next(this.organization);
                   
                    this.getTimeSheetById();
                }
            }, error => {
                if (environment.logErrors) {
                    console.log(error);
                }
            })
        }
        else {
            this.authenticationService.organizationSubject.next(this.organization);
            this.getTimeSheetById();
        }

    }
    private loadLeaveDetail(id, year) {
        this.jobLeavedetailList = [];
        this.jobService.getPreviosuLeaveDetailByTimeSheet(id, year).subscribe(value => {
            if (environment.logErrors)
                console.log(value);
            if (value.successFlag) {
                this.jobLeavedetailList = [...value.data];
            }
        })
    }
    modalOpenLeave(steCont: HTMLDivElement, modal: any, ats: TimeSheetDetail) {
        debugger
        var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
        if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {
            this.loadLeaveDetail(currentOrgaization.jobDto.jobId, this.commonFunctionService.getYear());
            this.modalService.open(steCont, {
                centered: true,
                size: 'md'
            });
        }
        // alert("wlcom")
    }
    getTimeSheetById() {
        debugger
        var currentOrgaizations = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
        if(currentOrgaizations.organizationConfigurationDto!=null || currentOrgaizations.organizationConfigurationDto !=undefined){
        this.isHourly = currentOrgaizations.organizationConfigurationDto.isHourlyLog;
        }else{
            this.isHourly = false;
        }

        this.tsService.getTimeSheetByIdOrWeek(0).subscribe(res => {

            console.log(res);
            this.timeSheetDetailPending = [];
            this.tsService.weekNames = [];
            if (res.successFlag && res.data.length > 0) {
                // this.timeSheetGen.startDate =this.calendar.getToday();//HomeComponent.setDate(new Date(res.data[0].endDate));

                // this.timeSheetGen.startDate = this.calendar.getMonths('2021')  (HomeComponent.setDate(new Date(res.data[0].endDate)));
                // this.timeSheetGen.endDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);//HomeComponent.setDate(new Date(res.data[0].endDate));
                this.timeSheetDetailPending.splice(0, this.timeSheetDetailPending.length);

                // var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
                // if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {

                //     var orgConfigration = this.organizations.filter(x => x.id == currentOrgaization.id)[0].jobDto;

                //     this.job = orgConfigration;
                //     if (orgConfigration.jobDayDtos != null) {
                //         var jobDay = orgConfigration.jobDayDtos.filter(x => x.isStartingDay == true)[0];
                //         this.dayId = jobDay.dayId == 0 || jobDay.dayId == null ? 0 : jobDay.dayId;
                //     }
                // }
                this.dayId = 0;
                debugger
                res.data.forEach(ele => {

                    if (ele.timeSheetDailyActivityDtos != null) {
                        for (let i = ele.timeSheetDailyActivityDtos.length; i <= 6; i++) {
                            var dayType = 36;
                            if (i == 5 || i == 6) {
                                dayType = 35;
                            }
                            ele.timeSheetDailyActivityDtos.push({ dayTypeId: dayType, timeSheetDailyActivityId: 0, hours: null, dayId: i == 0 ? 1 : i, earning: 0, expense: 0 });
                        }
                        ele.hours = Number((ele.timeSheetDailyActivityDtos.map(item => item.hours).reduce((prev, next) => prev + next)).toFixed(2));
                        ele.expenseAmount = ele.timeSheetDailyActivityDtos.map(item => item.expense).reduce((prev, next) => prev + next);
                        ele.payAmount = ele.timeSheetDailyActivityDtos.map(item => item.earning).reduce((prev, next) => prev + next);
                        ele.leaves = ele.timeSheetDailyActivityDtos.map(item => item.totalLeave).reduce((prev, next) => prev + next);
                    } else {
                        ele.timeSheetDailyActivityDtos = [];
                        for (let i = 0; i <= 6; i++) {
                            var dayType = 36;
                            if (i == 5 || i == 6) {
                                dayType = 35;
                            }
                            ele.timeSheetDailyActivityDtos.push({ dayTypeId: dayType, timeSheetDailyActivityId: 0, hours: null, dayId: i + 1, earning: 0, expense: 0 });
                        }
                        ele.hours = 0;
                        ele.expenseAmount = 0;
                        ele.payAmount = 0;
                        ele.leaves = 0
                    }
                    if (ele.timeSheetDailyActivityDtos.filter(x => x.dayTypeId === 34)[0] != null) {
                        this.dayId = ele.timeSheetDailyActivityDtos.filter(x => x.dayTypeId === 34)[0].dayId;
                    } else {
                        this.dayId = 1;
                    }
                    ele.timeSheetDailyActivityDtos = ele.timeSheetDailyActivityDtos.sort((a, b) => (a.dayId > b.dayId) ? 1 : ((b.dayId > a.dayId) ? -1 : 0));
                    ele.timeSheetDailyActivityDtos = this.commonFunctionService.sortDays(this.dayId - 1, ele.timeSheetDailyActivityDtos);
                })
                // this.tsService.sortDays(this.dayId == null || this.dayId == 0 ? 1 : this.dayId - 1);
                // this.sortDays(2-1);
                debugger
                this.timeSheetDetailPending.push(...res.data.filter(x => x.statusId == 29))
                this.sentTimeSheets.push(...res.data.filter(x => x.statusId == 30 || x.timeSheetStatus == 32 || x.timeSheetStatus == 33))
                this.approvedTimeSheets.push(...res.data.filter(x => x.statusId == 31))


            }
        });
    }

    ngOnDestroy(): void {
        // this.dragulaService.remove('multiple-list-group');
    }

    generateNewTimeSheet() {
        this.availableTimeSheets.unshift({
            id: this.availableTimeSheets.length + 1,
            week: (this.availableTimeSheets.length + 1).toString(),
            allowOvertime: true,
            date: new Date(Date.now()).toUTCString(),
            status: 'In-Progress'
        })
    }

    onDoneTimeSheetClick(ats: SampleTimeSheet) {
        debugger
        ats.status = 'Done';
    }
    goTo(isHourlyLog,tsId, detailId, dayId) {
        debugger
        if(isHourlyLog)
        {
            this.routerNavigate.navigate(['/timesheet/hourly-activity/', tsId, detailId, dayId])
        }else{
        this.routerNavigate.navigate(['/timesheet/daily-activity/', tsId, detailId, dayId])
        }
    }
    onSendTimeSheet(ats: TimeSheetDetail) {
        debugger

        this.tsService.updateTimeSheetStatus(ats.timeSheetId, 'Send', false).subscribe(res => {
            if (res.successFlag) {
                this.sentTimeSheets.unshift(ats);
                this.timeSheetDetailPending.splice(this.timeSheetDetailPending.indexOf(ats), 1);
                console.log(ats, 'On Send Time Sheet');
            } else {
                alert("found some error")
            }
        })
    }

    onReSendTimeSheet(ats: TimeSheetDetail) {
        debugger
        this.blockUI.start("Sending Email for Timesheets...");
        // this.tsService.updateTimeSheetStatus(ats.id,'Send' , false).subscribe(res=>{
        //     if(res.successFlag){
        //         // this.sentTimeSheets.unshift(ats);
        //         // this.timeSheetDetailPending.splice(this.timeSheetDetailPending.indexOf(ats), 1);
        //         console.log(ats, 'On Send Time Sheet');
        //     }else{
        //         alert("found some error")
        //     }
        // })
    }

    onClickRemoveApproved(ats: TimeSheetDetail) {
        this.approvedTimeSheets.splice(this.approvedTimeSheets.indexOf(ats), 1);
    }
    drForm() {
        alert("sss")
    }
}
