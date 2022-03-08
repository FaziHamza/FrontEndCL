import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { optionalGetterForProp } from '@swimlane/ngx-datatable';
import { JobDay } from 'app/shared/models/job';
import { Lookup } from 'app/shared/models/lookup';
import { JobService } from 'app/shared/services/job.service';
import Swal from "sweetalert2";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { environment } from 'environments/environment';
import { LookupService } from 'app/shared/services/lookup.service';
import { read } from 'fs';

@Component({
  selector: 'app-add-edit-job-day',
  templateUrl: './add-edit-job-day.component.html',
  styleUrls: ['./add-edit-job-day.component.scss']
})
export class AddEditJobDayComponent implements OnInit {

  constructor(public lookupService  :LookupService, public jobService: JobService, private ref: ChangeDetectorRef , public commonFunctionService :CommonFunctionService ) { }
  @Input('jobDayModal') jobModel: JobDay[];
  getdayId: number = 0;
  shiftTypes: Lookup[] = [];
  shiftType: Lookup;
  shiftName: string = "";

  loadShiftType() {
    // this.lookupService.getTypes("Org", "Shift").
    this.lookupService.getAllByParam("Org", "Shift", "ALL", "0", true, true).subscribe(value => {
      if (environment.logErrors)
          console.log(value);
      if (value.successFlag) {
          this.shiftTypes = [...value.data];
          this.loadJobModalDayDetails();
      }
  })
  }
  public loadJobModalDayDetails(week = null, organizationConfiguration = null, shiftTypes: Lookup[] = null, shiftId = null) {
    debugger
    this.jobService.getJobDay(this.commonFunctionService.getJobId()).subscribe(res => {
      if (environment.showLogs)
          console.log(res);
      if (res.successFlag && res.data !=null)
      {
        debugger
        if(res.data.length!=1){
          week= res.data.length>0?res.data:null;
        }
        shiftId=8;
        organizationConfiguration =this.commonFunctionService.getOrganizationConfig();

        if(res.data.length>0)
        {
          shiftId = res.data[0].shiftId;
        }else
        {
          shiftId= organizationConfiguration.shiftId;
        }
        
        if (week !== null && week.length!=0) this.jobModel = week;
        var getShiftId = 0;
    
        if (true) {
          debugger
          if (shiftId == null || shiftId === 0) {
            getShiftId = organizationConfiguration.shiftId
          } else {
            getShiftId = shiftId;
          }
          if (week !=null) {
            
            this.jobService.week.days = [];
            for (let index = 0; index < week.length; index++) {
              let ed = week[index].endTime
              let sd = week[index].startTime
              var dayId = week[index].dayId;
              let day = this.getdayNameByDayId(dayId);
              let sTime = this.getTime(sd);
              let eTime = this.getTime(ed);
    
              if (sTime == "00:00:00" || eTime == "00:00:00")
                var data = { dayId: dayId, id: dayId, name: day, startDate: null, endDate: null, isStartingDay: week[index].isStartingDay, startTime: "10:00", endTime: "10:00", isStartError: false, isEndError: false, isWeekendDay: week[index].isWeekendDay , IsDayMax:false }
              else
                var data = { dayId: dayId, id: dayId, name: day, startDate: week[index].isWeekendDay==false?sTime:null, endDate: week[index].isWeekendDay==false?eTime:null, isStartingDay: week[index].isStartingDay, startTime: "10:00", endTime: "10:00", isStartError: false, isEndError: false, isWeekendDay: week[index].isWeekendDay, IsDayMax:false }
    
              this.jobService.week.days.push(data);
              // if (week[index].isStartingDay == true) {
              //   this.getdayId = index;
              //   this.sortDaysbyid(week[index].dayId);
              // }
            }
          } else {
            debugger
            if (organizationConfiguration != null) {
              this.jobService.week.days = [];
       
              for (let index = 0; index < 7; index++) {
    
                // let ed = week[index].endTime
                // let sd = week[index].startTime
                var dayId = this.getId(index + 1);
                let day = this.getdayNameByDayId(index + 1);
                let sTime = organizationConfiguration.startTime;
                let eTime = organizationConfiguration.endTime;
                var isWeekEnd: boolean= false;
                if (sTime == "00:00:00" || eTime == "00:00:00")
                  var data1 = { dayId: dayId, id: dayId, name: day, startDate: null, endDate: null, isStartingDay: organizationConfiguration.weekStartDay, startTime: "10:00", endTime: "10:00", isStartError: false, isEndError: false, isWeekendDay: isWeekEnd , IsDayMax:false}
                else
                  var data1 = { dayId: dayId, id: dayId, name: day, startDate: sTime, endDate: eTime, isStartingDay: organizationConfiguration.weekStartDay, startTime: "10:00", endTime: "10:00", isStartError: false, isEndError: false, isWeekendDay: isWeekEnd , IsDayMax:false}
    
                this.jobService.week.days.push(data1);
    
              }
              this.sortDays(organizationConfiguration.weekStartDay - 1);
            }
          }
          debugger
          if (getShiftId != null)
            this.shiftName = this.shiftTypes.filter(x => x.lookupValue == getShiftId)[0].description;
        }
    
      }

      }, error => {
        if (environment.logErrors) {
            console.log(error);
        }
    })
      
   

  }
  public loadJobModalDetailsByDate(week = null) {
    debugger
    console.log(week);
    if (week !== null) this.jobModel = week;

    if (week !== null) {
      if (week.length > 0) {
        this.jobService.week.days = [];
        for (let index = 0; index < week.length; index++) {
          let ed = week[index].endDate
          let sd = week[index].startDate
          var dayId = week[index].dayId;
          let day = this.getdayNameByDayId(dayId);
          let sTime = sd;
          let eTime = ed;
          //  let er :Boolean =week[index].isEndError;
          //  let sr :Boolean = week[index].isStartError;

          if (sTime == "00:00:00" || eTime == "00:00:00")
            var data = { dayId: dayId, id: dayId, name: day, startDate: null, endDate: null, isStartingDay: week[index].isStartingDay, startTime: "10:00", endTime: "10:00", isStartError: week[index].isStartError, isEndError: week[index].isEndError, isWeekendDay: week[index].isWeekendDay, IsDayMax:false }
          else
            var data =
              { dayId: dayId, id: dayId, name: day, startDate: sTime, endDate: eTime, isStartingDay: week[index].isStartingDay, startTime: "10:00", endTime: "10:00", isStartError: week[index].isStartError, isEndError: week[index].isEndError, isWeekendDay: week[index].isWeekendDay, IsDayMax:false }

          this.jobService.week.days.push(data);
          // if (week[index].isStartingDay == true) {
          //   this.getdayId = index;
          //   this.sortDaysbyid(week[index].dayId);
          // }
        }
      }
    }
    console.warn(this.jobService.week.days);
    this.ref.detectChanges();
  }
  public getTime(date) {
    debugger
    if (date)
      return date.split('T')[1].slice(0,-3);
    else
      null;
  }
  public getId(day) {
    return day;
  }
  public getdayNameByDayId(day) {
    switch (day) {
      case 1:
        day = "Monday";
        return day;
      case 2:
        day = "Tuesday";
        return day;
      case 3:
        day = "Wednesday";
        return day;
      case 4:
        day = "Thursday";
        return day;
      case 5:
        day = "Friday";
        return day;
      case 6:
        day = "Saturday";
        return day;
      case 7:
        day = "Sunday";
        return day;
    }
  }

  ngOnInit() {
    this.loadShiftType();

  }
  cleareDate(i) {

    for (let a = i + 1; a < this.jobService.week.days.length; a++) {
      if (a != i) {
        this.jobService.week.days[i].endDate = null;
        this.jobService.week.days[i].isEndError = false;
        this.jobService.week.days[i].isStartError = false;

      }
    }

  }
  isWeekEndOff(i) {
    debugger
    let self = this;
    if(this.jobService.week.days[i].startDate !=null || this.jobService.week.days[i].endDate !=null)
    {
      let dayName  = this.commonFunctionService.getFullDayNameByDayId(i+1); 
      Swal.fire({
        title: 'Day Status',
        html: `Do you want to mark `+ dayName+` off`,
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
          debugger
          // this.jobService.week.days[i].isWeekendDay = false;
          for (let a = i + 1; a < self.jobService.week.days.length + 1; a++) {
            if (a != i) {
              self.jobService.week.days[i].startDate = null;
              self.jobService.week.days[i].endDate = null;
              self.jobService.week.days[i].isWeekendDay = true;
            }
          }
  
        } else {
          self.jobService.week.days[i].isWeekendDay = false;
  
        }
      });
    }else{

    }
  



  }
  clearDate(i) {

    for (let a = i + 1; a < this.jobService.week.days.length + 1; a++) {
      if (a != i) {
        this.jobService.week.days[i].startDate = null;
        this.jobService.week.days[i].endDate = null;
        // this.jobService.week.days[i].isEndError = true;
        // this.jobService.week.days[i].isStartError = true;
        this.jobService.week.days[i].isEndError = false;
        this.jobService.week.days[i].isStartError = false;

      }
    }

  }
  sortDays(i) {

    let weeks = [];
    this.jobService.week.days[i].isStartingDay = true;


    weeks.push(this.jobService.week.days[i]);

    for (let a = i + 1; a < this.jobService.week.days.length; a++) {
      if (a != i) {
        this.jobService.week.days[a].isStartingDay = false;
        weeks.push(this.jobService.week.days[a]);
      }
    }
    for (let a = 0; a < i; a++) {
      if (a != i) {
        this.jobService.week.days[a].isStartingDay = false;
        weeks.push(this.jobService.week.days[a]);
      }
    }
    this.jobService.week.days = [];
    this.jobService.week.days = weeks;
  }
  sortDaysbyid(i) {

    let weeks = [];
    this.jobService.week.days[0].isStartingDay = true;
    weeks.push(this.jobService.week.days[i]);

    for (let a = i + 1; a < this.jobService.week.days.length; a++) {
      if (a != i) {
        this.jobService.week.days[a].isStartingDay = false;
        weeks.push(this.jobService.week.days[a]);
      }
    }
    for (let a = 0; a < i; a++) {
      if (a != i) {
        this.jobService.week.days[a].isStartingDay = false;
        weeks.push(this.jobService.week.days[a]);
      }
    }
    this.jobService.week.days = [];
    this.jobService.week.days = weeks;
  }


}
