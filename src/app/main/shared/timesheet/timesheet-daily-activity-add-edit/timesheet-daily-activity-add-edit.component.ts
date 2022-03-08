import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { repeaterAnimation } from '@core/animations/core.animation';
import { timeSheetDetailActivityDto } from 'app/shared/models/timeSheetDetail';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { TimesheetService } from 'app/shared/services/timesheet.service';

@Component({
    selector: 'app-timesheet-daily-activity-add-edit',
    templateUrl: './timesheet-daily-activity-add-edit.component.html',
    styleUrls: ['./timesheet-daily-activity-add-edit.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None
})
export class TimesheetDailyActivityAddEditComponent implements OnInit {

    constructor(public tsService: TimesheetService, public ref: ChangeDetectorRef,public commonFunctionService: CommonFunctionService) { }

    // @Input() checkinTypes = [];
    // @Input() leavesTypes = [];

    ngOnInit(): void {
        
    }


    /**
     * Add Item
     */

    nextClicked: boolean = false;
    
    btnSaveDailyActivity() {
        this.nextClicked = false;
        if (this.tsService.dailyActivityForm.valid) {
            this.nextClicked = false;


            this.tsService.dailyActivityForm.value.forEach(l => {

                this.tsService.timeSheetDetailActivity.push({
                    timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                    timeSheetDailyActivityId: 0,
                    entryDateTime: l.hours,
                    activityTypeId: l.type,
                    comments: l.comments,
                    isLeave: l.isLeave,
                    isSysAdded:l.isSysAdded,
                });
            });
            console.log(JSON.stringify(this.tsService.timeSheetDetailActivity));
        } else {
            this.nextClicked = true;
            alert("ERROR")
        }
    }
   

    finalArray = [{
        timeSheetDailyActivityId: 1
        , TimeIn: '02:28'
        , TimeOut: '03:28'
        , Duraion: 1
        , BreakIn: '02:28'
        , BreakOut: '03:28'
    }];
    calculatehours() {
        debugger
        this.tsService.timeSheetDetailActivity = [];
        this.tsService.dailyActivityForm.value.forEach(l => {

            this.tsService.timeSheetDetailActivity.push({
                timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                timeSheetDailyActivityId: 0,
                entryDateTime: l.hours,
                activityTypeId: l.type,
                comments: l.comments,
                isLeave: l.isLeave,
                isSysAdded:l.isSysAdded,
            });
        });


    }

    isLeaveSelect(e, i) {
        debugger
        // this.dailyActivityForm.removeAt(i);
        if (this.tsService.dailyActivityForm.at(i).get('isShow').value)
            (this.tsService.dailyActivityForm.at(i).get('isShow').patchValue(false));
        else
            (this.tsService.dailyActivityForm.at(i).get('isShow').patchValue(true));
        this.ref.detectChanges();
        // ((this.dailyActivityForm.get('controls') as FormArray).at(i) as FormGroup).get('isShow').patchValue(true);
        // alert(i)
        // if(e.target.checked)
        // this.applyForLeave =true;
        // else
        // this.applyForLeave =false;
        // this.dailyActivityForm[i].type=null;
        // Object.keys(this.JobLeaveModal).forEach(name => {
        //     if (this.dailyActivityForm.controls[name]) {
        //         this.dailyActivityForm.controls[name].patchValue(this.JobLeaveModal[name], { onlySelf: true });
        //     }
        // });
        // this.dailyActivityForm.controls["type"].patchValue(null, { onlySelf: true });
    }




}
