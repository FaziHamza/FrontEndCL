import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from "@angular/animations";
import { repeaterAnimation } from "../../../../../@core/animations/core.animation";
import { TimesheetService } from 'app/shared/services/timesheet.service';
import { JobSalaryDto, TimeSheetDetail, timeSheetDetailActivityDto, TimeSheetDetailActivityPostDto, timeSheetDetailInfo, timesheetDetailsById } from 'app/shared/models/timeSheetDetail';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { TimesheetDailyActivityAddEditComponent } from '../timesheet-daily-activity-add-edit/timesheet-daily-activity-add-edit.component';
import { LookupService } from 'app/shared/services/lookup.service';
import { environment } from 'environments/environment.prod';
import { Lookup } from 'app/shared/models/lookup';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { Job, JobLeavedetail } from 'app/shared/models/job';
import { JobService } from 'app/shared/services/job.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThrowStmt } from '@angular/compiler';
// import{jsonToPivotjson} from 
@Component({
  selector: 'app-timesheet-daily-activity',
  templateUrl: './timesheet-daily-activity.component.html',
  styleUrls: ['./timesheet-daily-activity.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class TimesheetDailyActivityComponent implements OnInit {
  timeSheetDetailInfo: timeSheetDetailInfo[] = [];
  timeSheetDetailActivityDto: timeSheetDetailActivityDto[] = [];

  @ViewChild(TimesheetDailyActivityAddEditComponent) timesheetDailyActivityAddEditComponent: TimesheetDailyActivityAddEditComponent;

  constructor(public commonFunctionService: CommonFunctionService,
    public jobService: JobService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    public tsService: TimesheetService, public activeRoute: ActivatedRoute,
    public lookupService: LookupService) {
  }
  applyForLeave: boolean = false;
  showComments: boolean = false;
  commentMessage: string = '';

  timeSheetId: number = 0;
  detailId: number = 0;
  totalEarning;
  getDayId: number = 0;
  isLoad: boolean = false;
  ngOnInit(): void {
    this.resetData();
    this.tsService.leaveLabel = '';
    this.tsService.isLocalLeave = false;
    var getUrl = window.location.href;
    console.log("Fazi getUrl: " + getUrl)
    var stuff = getUrl.split('/');
    this.timeSheetId = Number(stuff[stuff.length - 3]);
    this.detailId = Number(stuff[stuff.length - 2]);
    var dayId = stuff[stuff.length - 1];
    this.getDayId = Number(dayId);
    console.log("timeSheetId= " + this.timeSheetId);
    console.log("detailId = " + this.detailId);
    console.log("dayId = " + dayId + "= " + this.commonFunctionService.getFullDayNameByDayId(this.getDayId));

    this.loadCheckinTypes();
    debugger
    var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
    if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {
      this.loadLeavesTypes(currentOrgaization.jobDto.jobId);
      this.loadTimeSheetDailyActivity(this.timeSheetId, this.detailId, currentOrgaization.jobDto.jobId);

      this.tsService.dailyActivityForm.clear();
    }

  }

  resetData() {
    this.tsService.jobLeavedetailList = [];
  }

  private loadCheckinTypes() {
    this.lookupService.getAllByParam("Timesheet", "AtType", "ALL", "0", true, true).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.tsService.checkinTypes = [...value.data];
        this.tsService.localCheckinTypes = [...value.data];
      }
    })
  }
  private loadTimeSheetDailyActivity(timesheetid, id, jobid) {

    this.tsService.getTimesheetDetailsById(timesheetid, id, jobid, this.getDayId).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      debugger
      // && value.data!=null
      if (value.successFlag) {
        this.tsService.timesheetDetailsByIdData = [...value.data][0];
        console.log(this.tsService.timesheetDetailsByIdData);
        this.isLoad = true;
        this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.salaryRate =
          this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.timeSheetDetailActivityDtos == null
            ? this.tsService.timesheetDetailsByIdData.jobSalaryDto.salary : this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.salaryRate;
        ;
        if (this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.timeSheetDetailActivityDtos != null) {
          debugger
          let totalPerDayHour = environment.perDayhours;
          if (this.tsService.timesheetDetailsByIdData.jobDayDtos.length > 0 || this.tsService.timesheetDetailsByIdData.jobDayDtos != null || this.tsService.timesheetDetailsByIdData.jobDayDtos != undefined) {
            totalPerDayHour = (Date.parse(this.tsService.timesheetDetailsByIdData.jobDayDtos[0].endTime)) - (Date.parse(this.tsService.timesheetDetailsByIdData.jobDayDtos[0].startTime));
            let seconds = Math.floor(totalPerDayHour / 1000)
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            totalPerDayHour= this.commonFunctionService.hoursToTimeConvertforDb(minutes);

          }
          this.tsService.perDayhours=totalPerDayHour;
          // this.tsService.timesheetDetailsByIdData.jobDayDto =this.tsService.timesheetDetailsByIdData.jobDayDto[0];
          this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.timeSheetDetailActivityDtos.forEach(els => {
            let sTime = this.commonFunctionService.getTimeWithOutSecond(els.entryDateTime);
            els.entryDateTime = sTime;
            els.isShow = els.isLeave;
            els.jobLeaveId = els.activityTypeId;
            els.timeSheetDetailActivityTxt = this.tsService.ShowTitle(els.activityTypeId);
            els.isShowTxt = true;
            els.perDayhours = totalPerDayHour;

            // els.activityTypeId
          });

        }

        this.tsService.gettimeSheetDetailData(this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.timeSheetDetailActivityDtos)

      }
    })
  }
  private loadLeavesTypes(jobId) {
    // this.jobService.GetJobLeaveLookupList(jobId).subscribe(value => {
    this.lookupService.getAllByParam("Job", "LevType", "ALL", "0", true, true).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.tsService.leavesTypes = [...value.data];
      }
    })
  }

  public items = [
    {
      id: 1,
      type: '',
      time: '05:00',
      comment: '',
    },
    {
      id: 2,
      type: '',
      time: '',
      comment: '',
    }];

  public item = {
    itemName: '',
    itemQuantity: '',
    itemCost: ''
  };

  // Public Methods
  // -----------------------------------------------------------------------------------------------------


  emittedEvents($event: any) {
    console.log('Action : ', $event);
  }

  sendComment() {

  }

  btnSaveDailyActivity() {
    // this.nextClicked= false;
    if (this.tsService.dailyActivityForm.valid) {
      // this.nextClicked= false;
      let timeSheetDetailActivity: timeSheetDetailActivityDto[] = [];
      debugger
      var i = 0;
      this.tsService.dailyActivityForm.value.forEach(l => {
        let date = new Date();
        var getDate = this.commonFunctionService.setDateFormat(date, "-");
        debugger
        let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime
        let leaveId = l.isLeave == true && this.tsService.selectedLeaveObj != undefined ? this.tsService.selectedLeaveObj.jobLeaveId : l.activityTypeId;
        timeSheetDetailActivity.push({
          timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
          timeSheetDailyActivityId: this.detailId,
          entryDateTime: entryDateTime,
          activityTypeId: l.activityTypeId == null || l.activityTypeId == '' ? 0 : l.activityTypeId,
          comments: l.comments,
          isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
          jobLeaveId: l.leaveId,
          isSysAdded:l.isSysAdded,
        });
        i = i + 1;
      });
      console.log(JSON.stringify(timeSheetDetailActivity));
      let timeSheetDetailActivityPostDto = new TimeSheetDetailActivityPostDto();
      timeSheetDetailActivityPostDto.timeSheetDailyActivityId = this.detailId;

      timeSheetDetailActivityPostDto.timeSheetDailyActivityDto = this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto;
      timeSheetDetailActivityPostDto.timeSheetDailyActivityDto.timeSheetDetailActivityDtos = [];
      var temp = timeSheetDetailActivityPostDto.timeSheetDailyActivityDto.hours;
      timeSheetDetailActivityPostDto.timeSheetDailyActivityDto.earning = this.commonFunctionService.hoursToTimeConvertforDb(this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.hours) * this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.salaryRate;

      timeSheetDetailActivityPostDto.timeSheetDailyActivityDto.hours = this.commonFunctionService.hoursToTimeConvertforDb(this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.hours);
      timeSheetDetailActivityPostDto.timeSheetDailyActivityDto.salaryRate = this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.salaryRate
      timeSheetDetailActivityPostDto.timeSheetDetailActivityDtos = timeSheetDetailActivity;



      this.tsService.createTimeSheetDetailActivityId(timeSheetDetailActivityPostDto).subscribe(res => {
        timeSheetDetailActivityPostDto.timeSheetDailyActivityDto.hours = temp;
        if (res.successFlag) {
          this.toastrService.success(res.message);
          this.tsService.isLocalLeave = false;
        } else {
          this.toastrService.error("Error", res.message);
        }
      })


    } else {
      // this.nextClicked= true;
      alert("ERROR")
    }
  }
  // selectedLeaveObj:JobLeavedetail;

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
  modalOpenLeave(steCont: HTMLDivElement, modal: any) {
    debugger
    if (this.tsService.dailyActivityForm.length > 0) {
      var latestId = this.tsService.dailyActivityForm.at(this.tsService.dailyActivityForm.length - 1).get('activityTypeId').value;
      if (latestId === 61) {
        var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
        if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {
          if (this.tsService.jobLeavedetailList.length == 0 || this.tsService.jobLeavedetailList == null) {
            this.loadLeaveDetail(currentOrgaization.jobDto.jobId, this.detailId, this.commonFunctionService.getYear());
          }
        }
        this.modalService.open(steCont, {
          centered: true,
          size: 'md'
        });
      } else if (latestId !== 57) {
        this.toastrService.info("Time Out", "Please timout first")
      }
      else {
        var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
        if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {
          if (this.tsService.jobLeavedetailList.length == 0 || this.tsService.jobLeavedetailList == null) {
            this.loadLeaveDetail(currentOrgaization.jobDto.jobId, this.detailId, this.commonFunctionService.getYear());
          }
        }
        this.modalService.open(steCont, {
          centered: true,
          size: 'md'
        });
      }
    } else {
      var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
      if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {
        if (this.tsService.jobLeavedetailList.length == 0 || this.tsService.jobLeavedetailList == null) {
          this.loadLeaveDetail(currentOrgaization.jobDto.jobId, this.detailId, this.commonFunctionService.getYear());
        }
      }
      this.modalService.open(steCont, {
        centered: true,
        size: 'md'
      });
    }


    // alert("wlcom")
  }
  selectLeave() {
    if (this.tsService.jobLeavedetailList.length > 0)
      this.tsService.addLeave(0);

  }


}


