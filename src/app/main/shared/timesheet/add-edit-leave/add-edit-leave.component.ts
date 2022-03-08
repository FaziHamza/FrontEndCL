import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { repeaterAnimation } from '@core/animations/core.animation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobLeavedetail } from 'app/shared/models/job';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { JobService } from 'app/shared/services/job.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { TimesheetService } from 'app/shared/services/timesheet.service';
import { environment } from 'environments/environment';
import { BlockUI, NgBlockUI } from "ng-block-ui";


@Component({
  selector: 'app-add-edit-leave',
  templateUrl: './add-edit-leave.component.html',
  styleUrls: ['./add-edit-leave.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class AddEditLeaveComponent implements OnInit {

  constructor(public tsServices: TimesheetService , public jobService: JobService,
    public commonFunctionService: CommonFunctionService, private modalServiceHourly: NgbModal,
    public lookupService: LookupService) { }
    @Input('indexId') indexId: number = 0;
    
    @Input('dayName') dayName: string = "";

    
    @Input('seletecTimeSheetDailyActivityId') seletecTimeSheetDailyActivityId: number = 0;
    getseletecTimeSheetDailyActivityId;
    @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    debugger
    this.getseletecTimeSheetDailyActivityId =this.seletecTimeSheetDailyActivityId;

    // this.tsServices.leaveActivities(this.seletecTimeSheetDailyActivityId);
  }
  modalOpenLeaveHourly(steCont: HTMLDivElement, modal: any) {
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
 

  calculateLeavHourSalary(i){
    alert(i)
  }


}
