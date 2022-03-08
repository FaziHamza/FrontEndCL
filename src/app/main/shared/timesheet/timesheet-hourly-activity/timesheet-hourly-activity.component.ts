import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { repeaterAnimation } from '@core/animations/core.animation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobLeavedetail } from 'app/shared/models/job';
import { timeSheetDailyActivityDto, timeSheetDailyActivityPostData, timeSheetDetailActivityDto } from 'app/shared/models/timeSheetDetail';
// import { timeSheetDailyActivityDto, timeSheetDailyActivityPostData } from 'app/shared/models/timeSheetDetail';
// import { timeSheetDailyActivityDto, timeSheetDailyActivityPost, TimeSheetDailyActivityPost, TimeSheetDetailActivityPostDto } from 'app/shared/models/timeSheetDetail';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { JobService } from 'app/shared/services/job.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { TimesheetService } from 'app/shared/services/timesheet.service';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: 'app-timesheet-hourly-activity',
  templateUrl: './timesheet-hourly-activity.component.html',
  styleUrls: ['./timesheet-hourly-activity.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class TimesheetHourlyActivityComponent implements OnInit {

  commentMessage: string = '';
  showComments: boolean = false;
  weeks = [{ id: 1, name: 'Week 1' }];
  activityForm: FormArray = new FormArray([
  ]);

  // activities() {
  //   return  this.tsServices.hourlyActivityForm.controls as FormGroup[]
  // }

  private verticalWizardStepper: Stepper;
  nextClicked: boolean = false;
  dayId: number = 0;
  timeSheetId: number = 0;
  detailId: number = 0;

  @BlockUI() blockUI: NgBlockUI;
  btnSave() {

  }
  daysOfWeek = [{
    weekId: 1, days: [
      { name: 'Monday', max: 12, cannotAdd: false, value: 0 },
      { name: 'Tuesday', max: 12, cannotAdd: false, value: 0 },
      { name: 'Wednesday', max: 12, cannotAdd: false, value: 0 },
      { name: 'Thursday', max: 12, cannotAdd: false, value: 0 },
      { name: 'Friday', max: 12, cannotAdd: false, value: 0 },
      { name: 'Saturday', max: 12, cannotAdd: true, value: 0 },
      { name: 'Sunday', max: 12, cannotAdd: true, value: 0 },
    ]
  }];

  constructor(public tsServices: TimesheetService, public jobService: JobService,
    public commonFunctionService: CommonFunctionService, private modalServiceHourly: NgbModal,
    public lookupService: LookupService, private toastrService: ToastrService,
  ) {
  }

  getDaysOfWeek(week) {
    return this.daysOfWeek.find(f => f.weekId === week.id)?.days
  }
  sendComment() {

  }

  resetDate() {
    this.tsServices.hourlyActivityForm.clear();
    this.tsServices.leaveActivityForm.clear();
    this.tsServices.isLocalLeave =false;
    this.tsServices.selectRowClicked =-1;



  }
  ngOnInit(): void {
    this.resetDate();
    var getUrl = window.location.href;
    console.log("Fazi getUrl: " + getUrl)
    var stuff = getUrl.split('/');
    this.timeSheetId = Number(stuff[stuff.length - 3]);
    this.detailId = Number(stuff[stuff.length - 2]);
    var dayId = stuff[stuff.length - 1];
    // this.getDayId = Number(dayId);


    this.verticalWizardStepper = new Stepper(document.querySelector('#stepper2'), {
      linear: false,
      animation: true
    });
    this.verticalWizardStepper.to(1);
    var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
    if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null)
     {
      // this.loadTimeSheetDailyActivity(this.timeSheetId, this.detailId, currentOrgaization.jobDto.jobId);
      this.loadTimeSheetDailyActivity(this.timeSheetId, this.detailId, currentOrgaization.jobDto.jobId);
    }

    
    // this.loadTimeSheetDailyActivity(260,1317,62);
    var currentOrgaization = JSON.parse(localStorage.getItem("currentOrgaization") == 'undefined' ? null : localStorage.getItem("currentOrgaization"));
    if (currentOrgaization.jobDto != null || typeof currentOrgaization.jobDto != null) {
      this.loadLeavesTypes(currentOrgaization.jobDto.jobId);

      this.tsServices.jobLeavedetailList = [];
      for (let i = 1; i < 1; i++) {
        this.weeks.push({ id: i, name: `Week ${i}` })
        this.daysOfWeek.push({
          weekId: i, days: [
            { name: 'Monday', max: 24, cannotAdd: false, value: 0 },
            { name: 'Tuesday', max: 24, cannotAdd: false, value: 0 },
            { name: 'Wednesday', max: 24, cannotAdd: false, value: 0 },
            { name: 'Thursday', max: 24, cannotAdd: false, value: 0 },
            { name: 'Friday', max: 24, cannotAdd: false, value: 0 },
            { name: 'Saturday', max: 24, cannotAdd: true, value: 0 },
            { name: 'Sunday', max: 24, cannotAdd: true, value: 0 },
          ]
        })
      }
    }
  }
  private loadLeavesTypes(jobId) {
    // this.jobService.GetJobLeaveLookupList(jobId).subscribe(value => {
    this.lookupService.getAllByParam("Job", "LevType", "ALL", "0", true, true).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.tsServices.leavesTypes = [...value.data];
      }
    })
  }

  onSaveWeek(week: { name: string; id: number }) {
    let daysOfWeek = this.getDaysOfWeek(week);
    console.log(week, daysOfWeek);
  }



  seletecTimeSheetDailyActivityId: number = 0;
  dayName: string = "";
  indexId: number = 0;


  selectLeave(steCont: HTMLDivElement, modal: any, id: any, indexId, name) {
    this.seletecTimeSheetDailyActivityId = id;
    this.dayName = name;

    this.indexId = indexId;
    this.verticalWizardNext();
    // this.modalServiceHourly.open(steCont, {
    //   centered: true,
    //   size: 'lg'
    // });
  }


  btnSaveData() {
    if (this.tsServices.hourlyActivityForm.valid) {
      this.blockUI.start("Saving Data...");
      // this.nextClicked= false;
      let timeSheetDailyActivity: timeSheetDailyActivityDto[] = [];
      debugger
      var i = 0;
      this.tsServices.hourlyActivityForm.value.forEach(l1 => {
        let timeSheetDetailActivity: timeSheetDetailActivityDto[] = [];

        this.tsServices.leaveActivityForm.value.forEach(l => {
          if (l1.timeSheetDailyActivityId == l.timeSheetDailyActivityId) {
            let date = new Date();
            var getDate = this.commonFunctionService.setDateFormat(date, "-");
            let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime
            timeSheetDetailActivity.push({
              timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
              timeSheetDailyActivityId: l1.timeSheetDailyActivityId,
              entryDateTime: entryDateTime,
              activityTypeId: l.activityTypeId == null || l.activityTypeId == '' ? 0 : l.activityTypeId,
              comments: l.comments,
              isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
              jobLeaveId: l.leaveId,
              isSysAdded:l.isSysAdded,

            });
          }

        });
        console.log(JSON.stringify(timeSheetDetailActivity));


        timeSheetDailyActivity.push(
          {
            hours: l1.hours,
            timeSheetDailyActivityId: l1.timeSheetDailyActivityId,
            totalLeave: l1.totalLeave,
            comments: l1.comments,
            dayId: l1.dayId,
            timeSheetDetailActivityDtos: timeSheetDetailActivity
          });
        i = i + 1;
      });
      console.log(JSON.stringify(timeSheetDailyActivity));
      let timeSheetDetailActivityPostDto = new timeSheetDailyActivityPostData();
      timeSheetDetailActivityPostDto.isLeaveForm =false;
      timeSheetDetailActivityPostDto.jobId = this.commonFunctionService.getJobId();
      timeSheetDetailActivityPostDto.timeSheetDailyActivityDtos = timeSheetDailyActivity;

      this.tsServices.createTimeSheetDailyActivityId(timeSheetDetailActivityPostDto).subscribe(res => {
        // timeSheetDetailActivityPostDto.timeSheetDailyActivityDto.hours =temp;
        if (res.successFlag) {
          this.toastrService.success(res.message);
          this.tsServices.isLocalLeave = false;
          this.blockUI.stop();
        } else {
          this.toastrService.error("Error", res.message);
          this.blockUI.stop();
        }
      }, error => {
        this.blockUI.stop();
        if (environment.logErrors)
        this.toastrService.error("Error", "Sorry! Some exception has been occured, Please try again later.");
    })


    } else {
      // this.nextClicked= true;
      alert("ERROR")
    }
  }
  btnSaveLeaveData() {
    if (this.tsServices.hourlyActivityForm.valid) {
      this.blockUI.start("Saving Data...");
      let timeSheetDetailActivityPostDto = new timeSheetDailyActivityPostData();
      timeSheetDetailActivityPostDto.isLeaveForm =true;
      timeSheetDetailActivityPostDto.jobId = this.commonFunctionService.getJobId();
      // this.nextClicked= false;
      let timeSheetDailyActivity: timeSheetDailyActivityDto[] = [];
      debugger
      var i = 0;
      this.tsServices.hourlyActivityForm.value.forEach(l1 => {
        let timeSheetDetailActivity: timeSheetDetailActivityDto[] = [];
        if (l1.timeSheetDailyActivityId == this.seletecTimeSheetDailyActivityId) {
          this.tsServices.leaveActivityForm.value.forEach(l => {
            let date = new Date();
            var getDate = this.commonFunctionService.setDateFormat(date, "-");
            let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime


            if (l.timeSheetDailyActivityId == this.seletecTimeSheetDailyActivityId) {

              timeSheetDetailActivity.push({
                timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                timeSheetDailyActivityId: l1.timeSheetDailyActivityId,
                entryDateTime: entryDateTime,
                activityTypeId: l.activityTypeId == null || l.activityTypeId == '' ? 0 : l.activityTypeId,
                comments: l.comments,
                isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
                jobLeaveId: l.leaveId,
                isSysAdded:l.isSysAdded,
              });
            }
            // else{
            //   timeSheetDetailActivity.push({
            //     timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
            //     timeSheetDailyActivityId: this.seletecTimeSheetDailyActivityId,
            //     entryDateTime: entryDateTime,
            //     activityTypeId: l.activityTypeId == null || l.activityTypeId == '' ? 0 : l.activityTypeId,
            //     comments: l.comments,
            //     isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
            //     jobLeaveId: l.leaveId
            //   });
            // }

          });
          console.log(JSON.stringify(timeSheetDetailActivity));

          timeSheetDailyActivity.push(
            {
              hours: l1.hours,
              timeSheetDailyActivityId: this.seletecTimeSheetDailyActivityId,
              totalLeave: l1.totalLeave,
              comments: l1.comments,
              timeSheetDetailActivityDtos: timeSheetDetailActivity.filter(x => x.timeSheetDailyActivityId == this.seletecTimeSheetDailyActivityId)
            });
  
          console.log(JSON.stringify(timeSheetDailyActivity));
  
          timeSheetDetailActivityPostDto.timeSheetDailyActivityDtos = timeSheetDailyActivity.filter(x => x.timeSheetDailyActivityId == this.seletecTimeSheetDailyActivityId);
  
          this.tsServices.createTimeSheetDailyActivityId(timeSheetDetailActivityPostDto).subscribe(res => {
            // timeSheetDetailActivityPostDto.timeSheetDailyActivityDto.hours =temp;
            if (res.successFlag) {
              this.toastrService.success(res.message);
              this.blockUI.stop();
              this.tsServices.isLocalLeave = false;
            } else {
              this.blockUI.stop();
              this.toastrService.error("Error", res.message);
              

            }
          }, error => {
            this.blockUI.stop();
            if (environment.logErrors)
            this.toastrService.error("Error", "Sorry! Some exception has been occured, Please try again later.");
        })

        }
     
      });



    } else {
      // this.nextClicked= true;
      alert("ERROR")
    }
  }
  isLeaveClicked:boolean=false;
  verticalWizardPrevious() {
    this.nextClicked = false;
    this.verticalWizardStepper.previous();
    this.isLeaveClicked =false;
    this.calculateMainBar();
  }
  verticalWizardNext() {
    this.nextClicked = false;
    this.verticalWizardStepper.next();
    this.isLeaveClicked =true;

    this.calculateMainBar();

  }

  modalOpenLeaveHourly(steCont: HTMLDivElement, modal: any) {
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
    this.modalServiceHourly.open(steCont, {
      centered: true,
      size: 'md'
    });
    // alert("wlcom")
  }

  private loadLeaveDetail(id, timeSheetId, year) {
    this.tsServices.jobLeavedetailList = [];
    this.jobService.getLeaveDetailByTimeSheet(id, timeSheetId, year).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.tsServices.jobLeavedetailList = [...value.data];
        // this.tsService.calculateLeave();
      }
    })
  }
 changeTableRowColor(idx: any, data: JobLeavedetail) {
    if (this.tsServices.jobLeavedetailList.length > 0) {
      debugger
      if (data.totalHours - data.totalConsummedHours <= 0) {

      } else {
        console.log(data);
        this.tsServices.selectedLeaveObj = data;

        // this.tsService.leaveLabel='';
        // this.tsService.leaveLabel =data.description+'';
        if (this.tsServices.selectRowClicked === idx) this.tsServices.selectRowClicked = -1;
        else this.tsServices.selectRowClicked = idx;
      }
    }

  }

  addLeave() {
    debugger
    this.tsServices.addHorulyLeave(0, this.seletecTimeSheetDailyActivityId);

  }
  

  private loadTimeSheetDailyActivity(timesheetid, id, jobid) {

    this.tsServices.getTimesheetDailyById(timesheetid, id, jobid, 3).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      debugger
      // && value.data!=null
      if (value.successFlag) {
        this.tsServices.timeSheetDailyActivityDtos = [...value.data][0];
        console.log(this.tsServices.timeSheetDailyActivityDtos);
        // this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.salaryRate =
        // this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.timeSheetDetailActivityDtos==null
        //  ?this.tsService.timesheetDetailsByIdData.jobSalaryDto.salary:this.tsService.timesheetDetailsByIdData.timeSheetDailyActivityDto.salaryRate;
        // ;

        if (this.tsServices.timeSheetDailyActivityDtos.timeSheetDailyActivityDtos.filter(x => x.dayType === 34)[0] != null) {
          this.dayId = this.tsServices.timeSheetDailyActivityDtos.timeSheetDailyActivityDtos.filter(x => x.dayType === 34)[0].dayId;
      } else {
          this.dayId = 1;
      }
      this.tsServices.timeSheetDailyActivityDtos.timeSheetDailyActivityDtos = this.tsServices.timeSheetDailyActivityDtos.timeSheetDailyActivityDtos.sort((a, b) => (a.dayId > b.dayId) ? 1 : ((b.dayId > a.dayId) ? -1 : 0));
      this.tsServices.timeSheetDailyActivityDtos.timeSheetDailyActivityDtos = this.commonFunctionService.sortDays(this.dayId - 1, this.tsServices.timeSheetDailyActivityDtos.timeSheetDailyActivityDtos);

        this.tsServices.timeSheetDailyActivityDtos.timeSheetDailyActivityDtos.forEach((element,indexRow) => {
          var perDayLimt = this.tsServices.timeSheetDailyActivityDtos.jobDayDtos.filter(x=>x.dayId==element.dayId)[0];
            var perDayHours =12;
            if(perDayLimt==undefined||perDayLimt==null){
              perDayHours= 12;
            }else{
              var totaltime= (Date.parse(perDayLimt.endTime)) - (Date.parse(perDayLimt.startTime));
              let seconds = Math.floor(totaltime / 1000)
              var minutes = Math.floor(seconds / 60);
              var hours = Math.floor(minutes / 60);
              perDayHours =hours;
            }

            element.perDayhours=perDayHours;

          if (element.timeSheetDetailActivityDtos != null) {
            // var finaResult = 0;
            // if (this.tsServices.timeSheetDailyActivityDtos.jobDayDtos != null || this.tsServices.timeSheetDailyActivityDtos.jobDayDtos.length > 0)
            // {
            //     var getDayDetail = this.tsServices.timeSheetDailyActivityDtos.jobDayDtos.filter(x => x.dayId == element.dayId)[0];
            //     finaResult = getDayDetail.isStartingDay == true ? 34 : getDayDetail.isWeekendDay ? 35 : 36;
            // }
            // else
            // {
            //     finaResult = indexRow == 1 ? 34 : indexRow == 6 || indexRow == 7 ? 35 : 36;
            // }
            
            // this.tsService.timesheetDetailsByIdData.jobDayDto =this.tsService.timesheetDetailsByIdData.jobDayDto[0];
            element.timeSheetDetailActivityDtos.forEach(els => {
              debugger
              if ((element.timeSheetDailyActivityId == els.timeSheetDailyActivityId) && (els.activityTypeId==60 || els.activityTypeId==61)) {
                let sTime = this.commonFunctionService.getTimeWithOutSecond(els.entryDateTime);
                els.entryDateTime = sTime;
                els.isShow = els.isLeave;
                els.jobLeaveId = els.jobLeaveId;
                els.timeSheetDailyActivityId = element.timeSheetDailyActivityId;
                els.timeSheetDetailActivityTxt = this.tsServices.ShowTitle(els.activityTypeId);
                els.isShowTxt = true;
                els.activityTypeId = els.activityTypeId
              }
            });
          }
  

        });
        
        this.tsServices.getTimeSheetDailyData(this.tsServices.timeSheetDailyActivityDtos.timeSheetDailyActivityDtos)
        this.calculateMainBar();
      }
    })
  }

  calculateMainBar() {

    this.tsServices.calculateMainBar();
  }

} 
