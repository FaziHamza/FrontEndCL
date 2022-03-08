import { Injectable } from '@angular/core';
import { HoursWorked, SampleTimeSheet } from "../models/sampleTimeSheet";
import { BaseApiService } from "./base-api.service";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "./authentication.service";
import { Observable, throwError } from "rxjs";
import { APIResponse, MiscAPIResponse } from "../models/a-p-i-Response";
import { timeInOutDto, Timesheet } from "../models/timesheet";
import { environment } from "../../../environments/environment";
import { timeSheetDailyActivityDto, timeSheetDailyActivityDtos, timeSheetDailyActivityPostData, TimeSheetDetail, timeSheetDetailActivityDto, TimeSheetDetailActivityPostDto, timeSheetDetailInfo, timesheetDetailsById } from '../models/timeSheetDetail';
import { SetupScreenStateDto } from '../models/SetupScreenStateDto';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Lookup } from '../models/lookup';
import { CommonFunctionService } from './common-funcation.service';
import { JobLeavedetail } from '../models/job';
import { updateLocale } from 'moment';
import Swal from 'sweetalert2';
// import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class TimesheetService extends BaseApiService<Timesheet> {
    url = environment.serverApiUrl + "/api/";
    // getContactTypes(queries?): Observable<MiscAPIResponse<ContactTypeLookup[],number>> {
    //     return this.http.get<MiscAPIResponse<ContactTypeLookup[],number>>(this.baseUrl + this.commonEndPoint + "/Types", {
    //         headers: this.headers
    //     });
    // }
    timesheetDetailsByIdData: timesheetDetailsById;
    selectRowClicked;
    jobLeavedetailList: JobLeavedetail[] = [];
    // jobLeavedetailList: JobLeavedetail[] = [];
    timeSheetDailyActivityDtos: timeSheetDailyActivityDtos;

    // selectjobleaveId;
    jobEndTime;
    leavesTypes: Lookup[] = [];
    checkinTypes: Lookup[] = [];
    localCheckinTypes: Lookup[] = [];
    leaveLabel: string = '';
    selectedLeaveObj: JobLeavedetail;
    getTimeSheet(): Observable<APIResponse<TimeSheetDetail[]>> {
        return this.http.get<APIResponse<TimeSheetDetail[]>>(this.url + this.commonEndPoint + "/Details", {
            headers: this.headers
        });
    }
    getTimeSheetByIdOrWeek(id: number): Observable<APIResponse<TimeSheetDetail[]>> {

        return this.http.get<APIResponse<TimeSheetDetail[]>>(this.url + this.commonEndPoint + "/GetTimeSheetById?timesheetId=" + id, {
            headers: this.headers
        });
    }
    getPendingSetups(): Observable<APIResponse<SetupScreenStateDto[]>> {
        return this.http.get<APIResponse<SetupScreenStateDto[]>>(this.url + "Setup/GetPendingSetups", {
            headers: this.headers
        });
    }
    geTimeInOutStatus(): Observable<APIResponse<timeInOutDto[]>> {
        return this.http.get<APIResponse<timeInOutDto[]>>(this.url + "Setup/GeTimeInOutStatus", {
            headers: this.headers
        });
    }
    updateTimeSheetStatus(id: number, status: string, isSendAgain: boolean): Observable<APIResponse<TimeSheetDetail>> {

        return this.http.get<APIResponse<TimeSheetDetail>>(this.url + this.commonEndPoint + "/UpdateTimeSheetStatusById?id=" + id + "&status=" + status + "&isSendAgain=" + isSendAgain, {
            headers: this.headers
        });
    }

    getTimeSheetDetailId(id: number): Observable<APIResponse<TimeSheetDetail[]>> {
        return this.http.get<APIResponse<TimeSheetDetail[]>>(this.url + this.commonEndPoint + "/DetailsById?Id=" + id, {
            headers: this.headers
        });
    }
    getTimesheetDetailsById(timesheetid: number, id: number, jobId: number, dayId: number): Observable<APIResponse<timesheetDetailsById[]>> {


        return this.http.get<APIResponse<timesheetDetailsById[]>>(this.url + this.commonEndPoint + "/GetTimesheetDetailsById?timesheetid=" + timesheetid + "&timeSheetDailyActivityId=" + id + "&jobId=" + jobId + "&dayId=" + dayId, {
            headers: this.headers
        });
    }
    getTimesheetDailyById(timesheetid: number, id: number, jobId: number, dayId: number): Observable<APIResponse<timesheetDetailsById[]>> {


        return this.http.get<APIResponse<timesheetDetailsById[]>>(this.url + this.commonEndPoint + "/GetTimesheetDailyById?timesheetid=" + timesheetid + "&timeSheetDailyActivityId=" + id + "&jobId=" + jobId + "&dayId=" + dayId, {
            headers: this.headers
        });
    }
    //Dasgboard Bar
    counter: number = 0;
    link: string = '0';
    txt: string = '';
    isTimeSheetAdded: number = 0;
    pendingItems = [];
    perDayhours=8;

    dailyActivityForm: FormArray = new FormArray([
    ]);


    onNext() {

        if (this.counter != this.pendingItems.length - 1) {
            this.counter++;
            this.link = this.pendingItems[this.counter].link;
            this.txt = this.pendingItems[this.counter].name;

        }
    }

    onPrevious() {
        if (this.counter > 0) {
            this.counter--;
            this.link = this.pendingItems[this.counter].link;
            this.txt = this.pendingItems[this.counter].name;
        }
    }

    dailyActivities() {
        return this.dailyActivityForm.controls as FormGroup[]
    }
    isLocalLeave: boolean = false;
    addLeave(id) {

        if (this.isLocalLeave) {
            id = 61;
            this.isLocalLeave = false;
        } else { id = 60; this.isLocalLeave = true }
        if (this.dailyActivityForm.length > 0) {
            var lastTime = this.dailyActivityForm.at(this.dailyActivityForm.length - 1).get('entryDateTime').value;
            this.dailyActivityForm.push(
                new FormGroup({
                    timeSheetDetailActivityId: new FormControl(''),
                    activityTypeId: new FormControl(id),
                    entryDateTime: new FormControl(lastTime, [Validators.required]),
                    comments: new FormControl(''),
                    isLeave: new FormControl(true),
                    jobLeaveId: new FormControl(id),
                    leaveId: new FormControl(this.selectedLeaveObj.jobLeaveId),
                    isShow: new FormControl(true),
                    isShowTxt: new FormControl(false),
                    timeSheetDetailActivityTxt: new FormControl(''),
                    isError: new FormControl(false),


                })
            );
        } else {
            this.dailyActivityForm.push(
                new FormGroup({
                    timeSheetDetailActivityId: new FormControl(''),
                    activityTypeId: new FormControl(id),
                    entryDateTime: new FormControl(this._commonFunctionService.getCurrentTime(), [Validators.required]),
                    comments: new FormControl(''),
                    isLeave: new FormControl(true),
                    jobLeaveId: new FormControl(id),
                    leaveId: new FormControl(this.selectedLeaveObj.jobLeaveId),
                    isShow: new FormControl(true),
                    isShowTxt: new FormControl(false),
                    timeSheetDetailActivityTxt: new FormControl(''),
                    isError: new FormControl(false),


                })
            );
        }

    }
    addItem(id) {
        if (this.isLocalLeave) {
            this.addLeave(0);
        } else {
            if (id != 0 && this.dailyActivityForm.length > 0) {
                var latestId = this.dailyActivityForm.at(this.dailyActivityForm.length - 1).get('activityTypeId').value;
                this.disabaledCheckInType(latestId);
            }

            var lastTime = this._commonFunctionService.getCurrentTime();
            if (this.dailyActivityForm.length > 0) {
                var latestId = this.dailyActivityForm.at(this.dailyActivityForm.length - 1).get('activityTypeId').value;
                if (latestId == 61) {
                    lastTime = this.dailyActivityForm.at(this.dailyActivityForm.length - 1).get('entryDateTime').value;
                }
            }
            this.dailyActivityForm.push(
                new FormGroup({

                    timeSheetDetailActivityId: new FormControl(''),
                    activityTypeId: new FormControl(),
                    entryDateTime: new FormControl(lastTime, [Validators.required]),
                    comments: new FormControl(''),
                    isLeave: new FormControl(false),
                    jobLeaveId: new FormControl(''),
                    isShow: new FormControl(false),
                    isShowTxt: new FormControl(false),
                    timeSheetDetailActivityTxt: new FormControl(''),
                    isError: new FormControl(false),
                    perDayhours: new FormControl(id),
                    isSysAdded: new FormControl(false),
                })
            );
        }
    }
    addAllDefault(timeSheetDetailModel: timeSheetDetailActivityDto = null) {
        this.dailyActivityForm.push(
            new FormGroup({

                timeSheetDetailActivityId: new FormControl(timeSheetDetailModel.timeSheetDetailActivityId),
                activityTypeId: new FormControl(timeSheetDetailModel.activityTypeId),
                entryDateTime: new FormControl(timeSheetDetailModel.entryDateTime),
                comments: new FormControl(timeSheetDetailModel.comments),
                isLeave: new FormControl(timeSheetDetailModel.isLeave),
                jobLeaveId: new FormControl(timeSheetDetailModel.jobLeaveId),
                isShow: new FormControl(false),
                isShowTxt: new FormControl(false),
                timeSheetDetailActivityTxt: new FormControl(''),
                isError: new FormControl(false),
                perDayhours: new FormControl(timeSheetDetailModel.perDayhours),
                isSysAdded: new FormControl(timeSheetDetailModel.isSysAdded),

            })
        );
    }

    addDefaultItem(id) {
        // this.disabaledCheckInType();
        this.checkinTypes = this.localCheckinTypes.filter(x => x.lookupValue == 56);
        this.dailyActivityForm.push(
            new FormGroup({
                timeSheetDetailActivityId: new FormControl(''),
                activityTypeId: new FormControl(id),
                entryDateTime: new FormControl(this._commonFunctionService.getCurrentTime(), [Validators.required]),
                comments: new FormControl(''),
                isLeave: new FormControl(false),
                jobLeaveId: new FormControl(''),
                isShow: new FormControl(false),
                isShowTxt: new FormControl(false),
                timeSheetDetailActivityTxt: new FormControl(''),
                isError: new FormControl(false),
                perDayhours :new FormControl(environment.perDayhours),
                isSysAdded :new FormControl(false),

            })
        );

    }
    calculateHourSalary() {

        this.timeSheetDetailActivity = [];
        let date = new Date();
        var getDate = this._commonFunctionService.setDateFormat(date, "-");
        this.dailyActivityForm.value.forEach(l => {
            let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime

            this.timeSheetDetailActivity.push({
                timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                timeSheetDailyActivityId: 10090,
                entryDateTime: entryDateTime,
                activityTypeId: l.activityTypeId,
                comments: l.comments,
                isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
                isSysAdded: l.isSysAdded,
            });
        });

        let totalTime = [];
        let totalBreaks = [];

        for (let ab = 0; ab < this.timeSheetDetailActivity.length; ab++) {

            if (this.timeSheetDetailActivity.length == 1) {
                totalTime.push(this.timeSheetDetailActivity[ab].entryDateTime);
            } else {
                if (this.timeSheetDetailActivity[ab].activityTypeId == 56 || this.timeSheetDetailActivity[ab].activityTypeId == 57) {
                    totalTime.push(this.timeSheetDetailActivity[ab].entryDateTime);
                }
            }

            if (this.timeSheetDetailActivity[ab].activityTypeId == 58 || this.timeSheetDetailActivity[ab].activityTypeId == 59) {
                totalBreaks.push(this.timeSheetDetailActivity[ab].entryDateTime);
            }

        }
        let timeDuration = 0;
        let timeBreak = 0;
        if (totalTime.length % 2 == 0) {
            for (let index = 0; index < totalTime.length; index++) {
                debugger
                var totaltime = (new Date(totalTime[index + 1])).getTime() - (new Date(totalTime[index]).getTime());

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        } else {
            var dt = new Date();

            // var dt =new Date(this.timesheetDetailsByIdData.jobDayDtos[0].endTime);
            totalTime.push(dt);
            for (let index = 0; index < totalTime.length; index++) {
                var totaltime = (Date.parse(totalTime[index + 1])) - (Date.parse(totalTime[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        }
        // Breaks
        if (totalBreaks.length % 2 == 0) {
            for (let index = 0; index < totalBreaks.length; index++) {
                var totalbrk = (Date.parse(totalBreaks[index + 1])) - (Date.parse(totalBreaks[index]));

                let seconds = Math.floor(totalbrk / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeBreak += minutes;
                index++;
            }
        } else {
            for (let index = 0; index < totalBreaks.length - 1; index++) {
                var totalbrk = (Date.parse(totalBreaks[index + 1])) - (Date.parse(totalBreaks[index]));

                let seconds = Math.floor(totalbrk / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeBreak += minutes;
                index++;
            }
        }

        var rtimeDuration = (timeDuration - timeBreak) / 60;
        var rhours = Math.floor(rtimeDuration);
        var minutes = (rtimeDuration - rhours) * 60;
        var rminutes = Math.round(minutes);

        this.timesheetDetailsByIdData.timeSheetDailyActivityDto.hours = (Number(((timeDuration - timeBreak)).toFixed(2)));


    }

    calculateLeave() {

        this.timeSheetDetailActivity = [];
        let date = new Date();
        var getDate = this._commonFunctionService.setDateFormat(date, "-");
        this.dailyActivityForm.value.forEach(l => {
            let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime

            this.timeSheetDetailActivity.push({
                timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                timeSheetDailyActivityId: 10090,
                entryDateTime: entryDateTime,
                activityTypeId: l.activityTypeId,
                comments: l.comments,
                isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
                isSysAdded:l.isSysAdded,
            });
        });

        let totalLeave = [];

        for (let ab = 0; ab < this.timeSheetDetailActivity.length; ab++) {

            if (this.timeSheetDetailActivity[ab].activityTypeId == 60 || this.timeSheetDetailActivity[ab].activityTypeId == 61) {
                totalLeave.push(this.timeSheetDetailActivity[ab].entryDateTime);
            }
        }
        let timeDuration = 0;
        if (totalLeave.length % 2 == 0) {
            for (let index = 0; index < totalLeave.length; index++) {
                var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        } else {
            for (let index = 0; index < totalLeave.length - 1; index++) {
                var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        }

        this.timesheetDetailsByIdData.timeSheetDailyActivityDto.totalLeave = Number((timeDuration / 60).toFixed(2));
        this.calculatePerLeave();

    }
    calculatePerLeave(): number {

        this.timeSheetDetailActivity = [];
        let date = new Date();
        var getDate = this._commonFunctionService.setDateFormat(date, "-");
        this.dailyActivityForm.value.forEach(l => {
            let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime

            this.timeSheetDetailActivity.push({
                timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                timeSheetDailyActivityId: 10090,
                entryDateTime: entryDateTime,
                activityTypeId: l.activityTypeId,
                leaveId: l.leaveId,
                comments: l.comments,
                isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
                isSysAdded:l.isSysAdded,

            });
        });

        let totalLeave = [];

        for (let ab = 0; ab < this.timeSheetDetailActivity.length; ab++) {

            if ((this.timeSheetDetailActivity[ab].activityTypeId == 60 || this.timeSheetDetailActivity[ab].activityTypeId == 61) && this.timeSheetDetailActivity[ab].leaveId == this.selectedLeaveObj.jobLeaveId) {
                totalLeave.push(this.timeSheetDetailActivity[ab].entryDateTime);
            }
        }
        let timeDuration = 0;
        if (totalLeave.length % 2 == 0) {
            for (let index = 0; index < totalLeave.length; index++) {
                var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        } else {
            for (let index = 0; index < totalLeave.length - 1; index++) {
                var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        }

        return Number((timeDuration / 60).toFixed(2));

    }

    checkLeaveError(i) {
        this.timeSheetDetailActivity = [];
        let date = new Date();
        var getDate = this._commonFunctionService.setDateFormat(date, "-");
        this.dailyActivityForm.value.forEach(l => {
            let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime

            this.timeSheetDetailActivity.push({
                timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                timeSheetDailyActivityId: 10090,
                entryDateTime: entryDateTime,
                activityTypeId: l.activityTypeId,
                leaveId: l.leaveId,
                comments: l.comments,
                isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
                isSysAdded:l.isSysAdded,

            });
        });

        let totalLeave = [];

        for (let ab = 0; ab < this.timeSheetDetailActivity.length; ab++) {

            if ((this.timeSheetDetailActivity[ab].activityTypeId == 60 || this.timeSheetDetailActivity[ab].activityTypeId == 61) && this.timeSheetDetailActivity[ab].leaveId == this.selectedLeaveObj.jobLeaveId) {
                totalLeave.push(this.timeSheetDetailActivity[ab].entryDateTime);
            }
        }

        let timeDuration = 0;
        if (totalLeave.length % 2 == 0) {
            if (totalLeave.length == 2) {
                for (let index = 0; index < totalLeave.length; index++) {
                    var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                    let seconds = Math.floor(totaltime / 1000)
                    var minutes = Math.floor(seconds / 60);
                    var hours = Math.floor(minutes / 60);
                    timeDuration += minutes;
                    index++;
                }
            } else {
                var lastIndex = totalLeave.length - 1;
                var secondIndex = totalLeave.length - 2;

                // for (let index = 0; index < totalLeave.length-totalLeave.length+2; index++) {
                var totaltime = (Date.parse(totalLeave[lastIndex])) - (Date.parse(totalLeave[secondIndex]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                // index++;
                // }

            }
        } else {
            for (let index = 0; index < totalLeave.length - 1; index++) {
                var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        }

        var perLeave = Number((timeDuration / 60).toFixed(2));
        if (this.selectedLeaveObj != undefined) {
            var objIndex = this.jobLeavedetailList.filter(x => x.jobLeaveId == this.selectedLeaveObj.jobLeaveId);
            var totalLeavs = this.calculatePerLeave();
            console.log(totalLeavs + ":: " + (objIndex[0].totalHours - objIndex[0].totalConsummedHours))

            var checkRemainLeave = objIndex[0].totalHours - objIndex[0].totalConsummedHours;
            for (let a = i + 1; a < this.dailyActivityForm.length + 1; a++) {
                if (a != i) {

                    if (checkRemainLeave < perLeave) {
                        ((this.dailyActivityForm.at(i) as FormGroup).get('entryDateTime').patchValue('', { onlySelf: true }));
                        ((this.dailyActivityForm.at(i) as FormGroup).get('isError').patchValue(true, { onlySelf: true }));
                        // this.calculateLeave();

                        var objLeave = this.jobLeavedetailList.filter(x => x.jobLeaveId == this.selectedLeaveObj.jobLeaveId);
                        console.log(totalLeavs + ":: " + (objLeave[0].totalHours - objLeave[0].totalConsummedHours))
                        var objIndexv2 = this.jobLeavedetailList.findIndex(x => x.jobLeaveId == this.selectedLeaveObj.jobLeaveId);

                        if (objIndexv2 != -1) {
                            if (objIndexv2 != undefined) {
                                if (this.jobLeavedetailList[objIndexv2].totalConsummedHours > 0) {
                                    this.calculateLeave();
                                    this.timesheetDetailsByIdData.timeSheetDailyActivityDto.totalLeave = Number((this.timesheetDetailsByIdData.timeSheetDailyActivityDto.totalLeave - this.jobLeavedetailList[objIndexv2].tempTotal).toFixed(1));
                                    this.jobLeavedetailList[objIndexv2].tempTotal = 0;
                                    this.jobLeavedetailList[objIndexv2].totalConsummedHours = this.jobLeavedetailList[objIndexv2].tempTotal;
                                }
                            }
                        }

                    } else {
                        ((this.dailyActivityForm.at(i) as FormGroup).get('isError').patchValue(false, { onlySelf: true }));
                        this.calculateLeave();
                        var objIndexv1 = this.jobLeavedetailList.findIndex(x => x.jobLeaveId == this.selectedLeaveObj.jobLeaveId);
                        if (objIndexv1 != -1) {
                            if (objIndexv1 != undefined) {

                                this.jobLeavedetailList[objIndexv1].tempTotal = this.jobLeavedetailList[objIndexv1].tempTotal == undefined ? 0 : this.jobLeavedetailList[objIndexv1].tempTotal;
                                this.jobLeavedetailList[objIndexv1].tempTotal += Number(perLeave.toFixed(2));
                                this.jobLeavedetailList[objIndexv1].totalConsummedHours = this.jobLeavedetailList[objIndexv1].tempTotal;
                                this.isLocalLeave = false;
                            }
                        }
                    }
                }
            }
        }

    }

    disabaledCheckInType(id) {


        // [
        //     {
        //       "Description": "Time In",
        //       "LookupValue": 56
        //     },
        //     {
        //       "Description": "Time Out",
        //       "LookupValue": 57
        //     },
        //     {
        //       "Description": "Break In",
        //       "LookupValue": 58
        //     },
        //     {
        //       "Description": "Break out",
        //       "LookupValue": 59
        //     }
        //   ]

        this.checkinTypes = this.localCheckinTypes;
        // const p1 = this.checkinTypes.find((p) => p.lookupValue == 56);
        // const p2 = this.checkinTypes.find((p) => p.lookupValue == 57);
        // const p3 = this.checkinTypes.find((p) => p.lookupValue == 58);
        // const p4 = this.checkinTypes.find((p) => p.lookupValue == 59);
        // p1.disabled = false;
        // p2.disabled = false;
        // p3.disabled = false;
        // p4.disabled = false;

        if (id == 56 || id == 59) {

            this.checkinTypes = this.checkinTypes.filter(x => x.lookupValue != 56).filter(x => x.lookupValue != 59);
            // p1.disabled = true;
            // p4.disabled = true;
        }
        else if (id == 58) {
            this.checkinTypes = this.checkinTypes.filter(x => x.lookupValue != 56).filter(x => x.lookupValue != 57).filter(x => x.lookupValue != 58);
            // p1.disabled = true;
            // p3.disabled = true;
            // p2.disabled = true;
        }
        else if (id == 57) {
            this.checkinTypes = this.checkinTypes.filter(x => x.lookupValue != 57).filter(x => x.lookupValue != 58).filter(x => x.lookupValue != 59);
        } else if (id == 61) {
            this.checkinTypes = this.checkinTypes.filter(x => x.lookupValue == 56);
        }

    }
    timeSheetDetailActivity: timeSheetDetailActivityDto[] = [];
    rowIndex;
    isLeaveSelect(e, i) {

        this.rowIndex = i;
        // this.dailyActivityForm.removeAt(i);

        // ((this.dailyActivityForm.get('controls') as FormArray).at(i) as FormGroup).get('isShow').patchValue(true);
        // console.log(i)
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
    deleteItem(id) {
        return Swal.fire({
            title: 'Are you sure?',
            text: `Are you sure you want to delete this record ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7367F0',
            cancelButtonColor: '#E42728',
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary ml-1'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.dailyActivityForm.removeAt(id);
                this.timesheetDetailsByIdData.timeSheetDailyActivityDto.salaryRate = this.timesheetDetailsByIdData.jobSalaryDto.salary;
                ;
                this.calculateHourSalary();
                this.calculateLeave();
                if (this.dailyActivityForm.length == 0) {
                    this.jobLeavedetailList = [];
                }
            }
        });


    }
    gettimeSheetDetailData(timeSheetDetailModel = null) {

        console.log(timeSheetDetailModel);
        if (timeSheetDetailModel !== null) {
            Object.keys(timeSheetDetailModel).forEach(name => {
                this.addAllDefault(timeSheetDetailModel[name]);
                if (this.dailyActivityForm.controls[name]) {
                    this.dailyActivityForm.controls[name].patchValue(timeSheetDetailModel[name], { onlySelf: true });
                }

                var latestId = this.dailyActivityForm.at(this.dailyActivityForm.length - 1).get('activityTypeId').value;
                if (latestId == 56) {
                    this.checkinTypes = this.localCheckinTypes.filter(x => x.lookupValue == 56);

                }
            });
            this.calculateHourSalary();
        } else {
            this.addDefaultItem(56);
            this.calculateHourSalary();
        }



    }

    updatePendingInformation(data: SetupScreenStateDto[]) {
        this.pendingItems = [];

        for (let index = 0; index < data.length; index++) {
            if (data[index].section == 'Job' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/job", name: "Job", detail: "Please add required “Basic Job” information. " }
                this.isTimeSheetAdded = 1;
                this.pendingItems.push(detail);
            }
            // Job day
            if (data[index].section == 'Job_Day' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/job", name: "Job_Day", detail: "Please add required “Job Schedule” information. " }
                this.isTimeSheetAdded = 1;
                this.pendingItems.push(detail);
            }
            // job salary
            if (data[index].section == 'Job_Salary' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/job", name: "Job_Salary", detail: "Please add your “Job Salary” information." }
                this.isTimeSheetAdded = 1;
                this.pendingItems.push(detail);
            }
            // job OverTime
            if (data[index].section == 'Job_OverTime' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/job", name: "Job_OverTime", detail: "Please add your “Job Overtime” information. " }
                this.isTimeSheetAdded = 1;
                this.pendingItems.push(detail);
            }
            // job leave 
            if (data[index].section == 'Job_Leave' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/job", name: "Job_Leave", detail: "Please add required “Job Leaves/Holidays” information." }
                this.isTimeSheetAdded = 1;
                this.pendingItems.push(detail);
            }

            if (data[index].section == 'Organization' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/org", name: "Organization", detail: "Please add your “Organization” information." }

                this.pendingItems.push(detail);
            }

            if (data[index].section == 'Contacts' && (data[index].screenStatus == 'Pending' || data[index].screenStatus == null)) {
                var detail = { link: "/commons/contacts", name: "Contacts", detail: "Please add your important “Contacts” information. " }
                this.pendingItems.push(detail);
            }

        }

        if (!this.IsExit('Job_Day', this.pendingItems) && !this.IsExit('Job_Salary', this.pendingItems)) {

            if (this.IsExitTimeSheet('GenerateTimesheets', 'Pending', data)) {
                this.isTimeSheetAdded = 1;
                var detail = { link: "/timesheet", name: "Generate Timesheets", detail: "Please add your “TimeSheet” by click button " }
                this.pendingItems.push(detail);
            } else {
                this.isTimeSheetAdded = 0;
            }

        }
        if (this.pendingItems.length > 0) {
            this.link = this.pendingItems[this.counter].link;
            this.txt = this.pendingItems[this.counter].name;

            // this.isTimeSheetAdded = this.pendingItems.filter(x => x.name === 'Job_Day').length;

        }
    }

    IsExit(name, arr) {
        return arr.some(function (el) {
            return el.name === name;
        });
    }
    IsExitTimeSheet(name, status, arr) {

        return arr.some(function (el) {
            return el.section === name && el.screenStatus === status;
        });
    }


    weekNames = [];
    setweek(i: number) {
        this.weekNames.push(i);
        for (let a = i + 1; a < this.weekNames.length; a++) {
            if (a != i) {
                this.weekNames.push(a);
            }
        }
        for (let a = 0; a < i; a++) {
            if (a != i) {
                this.weekNames.push(a);
            }
        }
    }

    setWeekOrder(day: number) {

        this.weekNames = [];
        var no = 0;
        for (let index = 1; index <= 7; index++) {
            if (no == 8) {
                no = 1;
            }
            if (day >= index) {
                this.weekNames.push(no == 0 ? day : no);
                if (no > day) {
                    no++;
                } else {
                    no = day;
                    no++;
                }


            } else {
                this.weekNames.push(no);
                no++;
            }


        }
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
    commonEndPoint = "Timesheet";

    constructor(private _httpClient: HttpClient,
        public _commonFunctionService: CommonFunctionService,

        public _authenticationService: AuthenticationService) {
        super(_httpClient, _authenticationService);
    }
    // add HourlyScreen 

    hourlyActivityForm: FormArray = new FormArray([
    ]);
    hourlyActivities() {
        return this.hourlyActivityForm.controls as FormGroup[]
    }
    leaveActivityForm: FormArray = new FormArray([
    ]);
    leaveActivities(id) {

        return (this.leaveActivityForm.controls as FormGroup[]).filter(x => x.controls.timeSheetDailyActivityId.value == id)
    }
    addHourlyItem(id) {

        if (this.isLocalLeave) {
            this.addHorulyLeave(0, 0);
        } else {
            if (id != 0 && this.hourlyActivityForm.length > 0) {
                var latestId = this.dailyActivityForm.at(this.hourlyActivityForm.length - 1).get('activityTypeId').value;
                this.disabaledCheckInType(latestId);
            }

            var lastTime = this._commonFunctionService.getCurrentTime();
            if (this.dailyActivityForm.length > 0) {
                var latestId = this.hourlyActivityForm.at(this.hourlyActivityForm.length - 1).get('activityTypeId').value;
                if (latestId == 61) {
                    lastTime = this.hourlyActivityForm.at(this.hourlyActivityForm.length - 1).get('entryDateTime').value;
                }
            }
            this.hourlyActivityForm.push(
                new FormGroup({

                    timeSheetDetailActivityId: new FormControl(''),
                    timeSheetDailyActivityId: new FormControl(621),
                    activityTypeId: new FormControl(),
                    entryDateTime: new FormControl(lastTime, [Validators.required]),
                    comments: new FormControl(''),
                    isLeave: new FormControl(false),
                    jobLeaveId: new FormControl(''),
                    isShow: new FormControl(false),
                    isShowTxt: new FormControl(false),
                    timeSheetDetailActivityTxt: new FormControl(''),
                    isError: new FormControl(false),
                    perDayhours: new FormControl(environment.perDayhours),



                })
            );
        }
    }

    addHorulyLeave(id, activityId) {

        if (this.isLocalLeave) {
            id = 61;
            this.isLocalLeave = false;
        } else { id = 60; this.isLocalLeave = true }
        if (this.leaveActivityForm.length > 0) {
            var lastTime = this.leaveActivityForm.at(this.leaveActivityForm.length - 1).get('entryDateTime').value;
            this.leaveActivityForm.push(
                new FormGroup({
                    timeSheetDetailActivityId: new FormControl(''),
                    timeSheetDailyActivityId: new FormControl(activityId),
                    activityTypeId: new FormControl(id),
                    entryDateTime: new FormControl(lastTime, [Validators.required]),
                    comments: new FormControl(''),
                    isLeave: new FormControl(true),
                    jobLeaveId: new FormControl(id),
                    leaveId: new FormControl(this.selectedLeaveObj.jobLeaveId),
                    isShow: new FormControl(true),
                    isShowTxt: new FormControl(false),
                    timeSheetDetailActivityTxt: new FormControl(''),
                    isError: new FormControl(false),
                    dayId: new FormControl(0),
                    isSysAdded: new FormControl(false),



                })
            );
        } else {
            this.leaveActivityForm.push(
                new FormGroup({
                    timeSheetDetailActivityId: new FormControl(''),
                    timeSheetDailyActivityId: new FormControl(activityId),
                    activityTypeId: new FormControl(id),
                    entryDateTime: new FormControl(this._commonFunctionService.getCurrentTime(), [Validators.required]),
                    comments: new FormControl(''),
                    jobLeaveId: new FormControl(id),
                    isLeave: new FormControl(true),
                    leaveId: new FormControl(this.selectedLeaveObj.jobLeaveId),
                    // leaveId: new FormControl(this.selectedLeaveObj.jobLeaveId),
                    isShow: new FormControl(true),
                    isShowTxt: new FormControl(false),
                    timeSheetDetailActivityTxt: new FormControl(''),
                    isError: new FormControl(false),
                    isSysAdded: new FormControl(false),


                })
            );
        }

    }

    addLeaveAllDefault(timeSheetDailyDataModel: timeSheetDetailActivityDto = null, id: number = 0) {
        debugger
        this.leaveActivityForm.push(
            new FormGroup({
                timeSheetDetailActivityId: new FormControl(timeSheetDailyDataModel.timeSheetDetailActivityId),
                timeSheetDailyActivityId: new FormControl(timeSheetDailyDataModel.timeSheetDailyActivityId),
                activityTypeId: new FormControl(timeSheetDailyDataModel.activityTypeId),
                entryDateTime: new FormControl(timeSheetDailyDataModel.entryDateTime),
                comments: new FormControl(timeSheetDailyDataModel.comments),
                isLeave: new FormControl(true),
                jobLeaveId: new FormControl(timeSheetDailyDataModel.jobLeaveId),
                leaveId: new FormControl(timeSheetDailyDataModel.jobLeaveId), //this.selectedLeaveObj.jobLeaveId
                // leaveId: new FormControl(this.selectedLeaveObj.jobLeaveId),
                isShow: new FormControl(true),
                isShowTxt: new FormControl(true),
                timeSheetDetailActivityTxt: new FormControl(this.ShowTitle(timeSheetDailyDataModel.activityTypeId)),
                isError: new FormControl(false),
                id: new FormControl(id + 1),
                isSysAdded :new FormControl(timeSheetDailyDataModel.isSysAdded),


            })
        );
    }

    calculateMainBar() {
        let timeSheetDailyActivity: timeSheetDailyActivityDto[] = [];

        var i = 0;
        this.hourlyActivityForm.value.forEach(l1 => {
            let timeSheetDetailActivity: timeSheetDetailActivityDto[] = [];

            this.leaveActivityForm.value.forEach(l => {
                if (l1.timeSheetDailyActivityId == l.timeSheetDailyActivityId) {
                    let date = new Date();
                    var getDate = this._commonFunctionService.setDateFormat(date, "-");
                    let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime
                    timeSheetDetailActivity.push({
                        timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                        timeSheetDailyActivityId: l1.timeSheetDailyActivityId,
                        entryDateTime: entryDateTime,
                        activityTypeId: l.activityTypeId == null || l.activityTypeId == '' ? 0 : l.activityTypeId,
                        comments: l.comments,
                        isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
                        jobLeaveId: l.leaveId,
                        perDayhours: l.perDayhours,
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
                    salaryRate: l1.salaryRate * l1.hours,
                    timeSheetDetailActivityDtos: timeSheetDetailActivity
                });
            i = i + 1;
        });
        console.log(JSON.stringify(timeSheetDailyActivity));
        let timeSheetDetailActivityPostDto = new timeSheetDailyActivityPostData();
        timeSheetDetailActivityPostDto.timeSheetDailyActivityDtos = timeSheetDailyActivity;

        this.timeSheetDailyActivityDtos.totalLeave = Number((timeSheetDetailActivityPostDto.timeSheetDailyActivityDtos.map(item => item.totalLeave).reduce((prev, next) => prev + next)).toFixed(2));
        this.timeSheetDailyActivityDtos.totalHours = Number((timeSheetDetailActivityPostDto.timeSheetDailyActivityDtos.map(item => item.hours).reduce((prev, next) => prev + next)).toFixed(2));

        this.timeSheetDailyActivityDtos.totalSalary = Number((timeSheetDetailActivityPostDto.timeSheetDailyActivityDtos.map(item => item.salaryRate).reduce((prev, next) => prev + next)).toFixed(2));
    }



    deleteLeaveItem(id, indx, activtyId) {

        return Swal.fire({
            title: 'Are you sure?',
            text: `Are you sure you want to delete this record ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7367F0',
            cancelButtonColor: '#E42728',
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary ml-1'
            }
        }).then((result) => {
            if (result.isConfirmed) {

                // (this.leaveActivityForm.controls as FormGroup[]).filter(x => x.controls.timeSheetDailyActivityId.value == activtyId).splice(0,id);
                this.leaveActivityForm.removeAt(id);
                this.isLocalLeave = true;
                // this.timesheetDetailsByIdData.timeSheetDailyActivityDto.salaryRate = this.timesheetDetailsByIdData.jobSalaryDto.salary;
                ;
                this.calculateLeavHourSalary(indx, activtyId);
                // this.calculateLeave();
                if (this.leaveActivityForm.length >= 0) {
                    this.jobLeavedetailList = [];
                    this.isLocalLeave = false;
                }
            }
        });


    }

    addItemList() {
        for (let index = 1; index <= 7; index++) {
            this.hourlyActivityForm.push(
                new FormGroup({
                    timeSheetDailyActivityId: new FormControl(),
                    name: new FormControl(this._commonFunctionService.getFullDayNameByDayId(index)),
                    totalLeave: new FormControl(''),
                    max: new FormControl(),
                    comment: new FormControl(),
                    cannotAdd: new FormControl(false),
                    hours: new FormControl(0, Validators.required),
                    isShowTxt: new FormControl(false),
                    timeSheetDetailActivityTxt: new FormControl(''),
                    isError: new FormControl(false),
                    perDayhours: new FormControl(environment.perDayhours),
                    dayId: new FormControl(0),
                    isSysAdded: new FormControl(false),


                })
            );

        }
    }

    addHourlyAllDefault(timeSheetDailyDataModel: timeSheetDailyActivityDto = null) {
        this.hourlyActivityForm.push(
            new FormGroup({
                timeSheetDailyActivityId: new FormControl(timeSheetDailyDataModel.timeSheetDailyActivityId),
                name: new FormControl(this._commonFunctionService.getFullDayNameByDayId(timeSheetDailyDataModel.dayId)),
                totalLeave: new FormControl(timeSheetDailyDataModel.totalLeave),
                max: new FormControl(),
                comments: new FormControl(timeSheetDailyDataModel.comments),
                cannotAdd: new FormControl(false),
                hours: new FormControl(timeSheetDailyDataModel.hours, Validators.required),
                perDayhours: new FormControl(timeSheetDailyDataModel.perDayhours),
                salaryRate: new FormControl(timeSheetDailyDataModel.salaryRate),
                dayId: new FormControl(timeSheetDailyDataModel.dayId),
                // isShowTxt: new FormControl(false),
                // timeSheetDetailActivityTxt: new FormControl(''),
                // isError: new FormControl(false),
            })
        );
    }

    getTimeSheetDailyData(timeSheetDailyDataModel = null) {

        console.log(timeSheetDailyDataModel);
        if (timeSheetDailyDataModel !== null) {
            Object.keys(timeSheetDailyDataModel).forEach((name, indexRow) => {
                this.addHourlyAllDefault(timeSheetDailyDataModel[name]);
                if (this.hourlyActivityForm.controls[name]) {
                    this.hourlyActivityForm.controls[name].patchValue(timeSheetDailyDataModel[name], { onlySelf: true });
                }
                console.log(indexRow)
                // var latestId = this.dailyActivityForm.at(this.dailyActivityForm.length - 1).get('activityTypeId').value;
                // if (latestId == 56) {
                //     this.checkinTypes = this.localCheckinTypes.filter(x => x.lookupValue == 56);

                // }
                var timeSheetDetailActivityDtos = timeSheetDailyDataModel[indexRow].timeSheetDetailActivityDtos
                if (timeSheetDetailActivityDtos != null) {
                    // timeSheetDetailActivityDtos.timeSheetDailyActivityId =timeSheetDailyDataModel[indexRow]
                    Object.keys(timeSheetDetailActivityDtos).forEach((name1, indexRow1) => {
                        console.log(indexRow + " : " + indexRow1)

                        if (timeSheetDailyDataModel[indexRow].timeSheetDailyActivityId == timeSheetDetailActivityDtos[indexRow1].timeSheetDailyActivityId) {
                            this.addLeaveAllDefault(timeSheetDetailActivityDtos[name1], indexRow1);
                            // this.addHorulyLeave(0,0);

                            // if (this.leaveActivityForm.controls[name1]) {
                            //     this.leaveActivityForm.controls[name1].patchValue(timeSheetDetailActivityDtos[name1], { onlySelf: true });
                            // }
                        }

                        // var latestId = this.dailyActivityForm.at(this.dailyActivityForm.length - 1).get('activityTypeId').value;
                        // if (latestId == 56) {
                        //     this.checkinTypes = this.localCheckinTypes.filter(x => x.lookupValue == 56);

                        // }
                    });
                }

            });
            // this.calculateHourSalary();
        } else {
            // this.addDefaultItem(56);
            // this.calculateHourSalary();
        }



    }

    calculateLeavHourSalary(idz, timeSheetDailyActivityId) {

        this.timeSheetDetailActivity = [];
        let date = new Date();
        var getDate = this._commonFunctionService.setDateFormat(date, "-");
        this.leaveActivityForm.value.forEach(l => {
            let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime

            this.timeSheetDetailActivity.push({
                timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                timeSheetDailyActivityId: l.timeSheetDailyActivityId,
                entryDateTime: entryDateTime,
                activityTypeId: l.activityTypeId,
                comments: l.comments,
                isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
                isSysAdded:l.isSysAdded,

            });
        });

        let totalTime = [];
        let totalBreaks = [];

        for (let ab = 0; ab < this.timeSheetDetailActivity.length; ab++) {

            if ((this.timeSheetDetailActivity[ab].activityTypeId == 60 || this.timeSheetDetailActivity[ab].activityTypeId == 61) && this.timeSheetDetailActivity[ab].timeSheetDailyActivityId == timeSheetDailyActivityId) {
                totalTime.push(this.timeSheetDetailActivity[ab].entryDateTime);
            }

            if (this.timeSheetDetailActivity[ab].activityTypeId == 58 || this.timeSheetDetailActivity[ab].activityTypeId == 59) {
                totalBreaks.push(this.timeSheetDetailActivity[ab].entryDateTime);
            }

        }
        let timeDuration = 0;
        let timeBreak = 0;
        if (totalTime.length % 2 == 0) {
            for (let index = 0; index < totalTime.length; index++) {
                var totaltime = (Date.parse(totalTime[index + 1])) - (Date.parse(totalTime[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        } else {
            var dt = new Date();

            // var dt =new Date(this.timesheetDetailsByIdData.jobDayDtos[0].endTime);
            totalTime.push(dt);
            for (let index = 0; index < totalTime.length; index++) {
                var totaltime = (Date.parse(totalTime[index + 1])) - (Date.parse(totalTime[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                // timeDuration += minutes;
                // index++;
            }
        }
        // Breaks
        if (totalBreaks.length % 2 == 0) {
            for (let index = 0; index < totalBreaks.length; index++) {
                var totalbrk = (Date.parse(totalBreaks[index + 1])) - (Date.parse(totalBreaks[index]));

                let seconds = Math.floor(totalbrk / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeBreak += minutes;
                index++;
            }
        } else {
            for (let index = 0; index < totalBreaks.length - 1; index++) {
                var totalbrk = (Date.parse(totalBreaks[index + 1])) - (Date.parse(totalBreaks[index]));

                let seconds = Math.floor(totalbrk / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeBreak += minutes;
                index++;
            }
        }

        var rtimeDuration = (timeDuration - timeBreak) / 60;
        var rhours = Math.floor(rtimeDuration);
        var minutes = (rtimeDuration - rhours) * 60;
        var rminutes = Math.round(minutes);
        var totalHours = this._commonFunctionService.hoursToTimeConvertforDb(Number(((timeDuration - timeBreak))).toFixed(2));
        ((this.hourlyActivityForm.at(idz) as FormGroup).get('totalLeave').patchValue(totalHours), { onlySelf: true });
        this.calculateMainBar();
    }

    calculateHourlyLeave() {

        this.timeSheetDetailActivity = [];
        let date = new Date();
        var getDate = this._commonFunctionService.setDateFormat(date, "-");
        this.leaveActivityForm.value.forEach(l => {
            let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime

            this.timeSheetDetailActivity.push({
                timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                timeSheetDailyActivityId: 100901,
                entryDateTime: entryDateTime,
                activityTypeId: l.activityTypeId,
                comments: l.comments,
                isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
                isSysAdded:l.isSysAdded,

            });
        });

        let totalLeave = [];

        for (let ab = 0; ab < this.timeSheetDetailActivity.length; ab++) {

            if (this.timeSheetDetailActivity[ab].activityTypeId == 60 || this.timeSheetDetailActivity[ab].activityTypeId == 61) {
                totalLeave.push(this.timeSheetDetailActivity[ab].entryDateTime);
            }
        }
        let timeDuration = 0;
        if (totalLeave.length % 2 == 0) {
            for (let index = 0; index < totalLeave.length; index++) {
                var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        } else {
            for (let index = 0; index < totalLeave.length - 1; index++) {
                var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        }

        this.timesheetDetailsByIdData.timeSheetDailyActivityDto.totalLeave = Number((timeDuration / 60).toFixed(2));
        // this.calculatePerLeave();

    }
    calculateHourlyPerLeave(): number {

        this.timeSheetDetailActivity = [];
        let date = new Date();
        var getDate = this._commonFunctionService.setDateFormat(date, "-");
        this.dailyActivityForm.value.forEach(l => {
            let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime

            this.timeSheetDetailActivity.push({
                timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                timeSheetDailyActivityId: 10090,
                entryDateTime: entryDateTime,
                activityTypeId: l.activityTypeId,
                leaveId: l.leaveId,
                comments: l.comments,
                isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
                isSysAdded:l.isSysAdded,

            });
        });

        let totalLeave = [];

        for (let ab = 0; ab < this.timeSheetDetailActivity.length; ab++) {

            if ((this.timeSheetDetailActivity[ab].activityTypeId == 60 || this.timeSheetDetailActivity[ab].activityTypeId == 61) && this.timeSheetDetailActivity[ab].leaveId == this.selectedLeaveObj.jobLeaveId) {
                totalLeave.push(this.timeSheetDetailActivity[ab].entryDateTime);
            }
        }
        let timeDuration = 0;
        if (totalLeave.length % 2 == 0) {
            for (let index = 0; index < totalLeave.length; index++) {
                var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        } else {
            for (let index = 0; index < totalLeave.length - 1; index++) {
                var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        }

        return Number((timeDuration / 60).toFixed(2));

    }

    checkHourlyLeaveError(i) {
        this.timeSheetDetailActivity = [];
        let date = new Date();
        var getDate = this._commonFunctionService.setDateFormat(date, "-");
        this.dailyActivityForm.value.forEach(l => {
            let entryDateTime = l.entryDateTime !== null && l.entryDateTime !== '' ? `${getDate + "T" + l.entryDateTime}` : l.entryDateTime

            this.timeSheetDetailActivity.push({
                timeSheetDetailActivityId: l.timeSheetDetailActivityId == '' || l.timeSheetDetailActivityId == null ? 0 : l.timeSheetDetailActivityId,
                timeSheetDailyActivityId: 10090,
                entryDateTime: entryDateTime,
                activityTypeId: l.activityTypeId,
                leaveId: l.leaveId,
                comments: l.comments,
                isLeave: l.isLeave == '' || l.isLeave == null ? false : l.isLeave,
                isSysAdded:l.isSysAdded,

            });
        });

        let totalLeave = [];

        for (let ab = 0; ab < this.timeSheetDetailActivity.length; ab++) {

            if ((this.timeSheetDetailActivity[ab].activityTypeId == 60 || this.timeSheetDetailActivity[ab].activityTypeId == 61) && this.timeSheetDetailActivity[ab].leaveId == this.selectedLeaveObj.jobLeaveId) {
                totalLeave.push(this.timeSheetDetailActivity[ab].entryDateTime);
            }
        }

        let timeDuration = 0;
        if (totalLeave.length % 2 == 0) {
            if (totalLeave.length == 2) {
                for (let index = 0; index < totalLeave.length; index++) {
                    var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                    let seconds = Math.floor(totaltime / 1000)
                    var minutes = Math.floor(seconds / 60);
                    var hours = Math.floor(minutes / 60);
                    timeDuration += minutes;
                    index++;
                }
            } else {
                var lastIndex = totalLeave.length - 1;
                var secondIndex = totalLeave.length - 2;

                // for (let index = 0; index < totalLeave.length-totalLeave.length+2; index++) {
                var totaltime = (Date.parse(totalLeave[lastIndex])) - (Date.parse(totalLeave[secondIndex]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                // index++;
                // }

            }
        } else {
            for (let index = 0; index < totalLeave.length - 1; index++) {
                var totaltime = (Date.parse(totalLeave[index + 1])) - (Date.parse(totalLeave[index]));

                let seconds = Math.floor(totaltime / 1000)
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                timeDuration += minutes;
                index++;
            }
        }

        var perLeave = Number((timeDuration / 60).toFixed(2));
        var objIndex = this.jobLeavedetailList.filter(x => x.jobLeaveId == this.selectedLeaveObj.jobLeaveId);
        var totalLeavs = this.calculatePerLeave();
        console.log(totalLeavs + ":: " + (objIndex[0].totalHours - objIndex[0].totalConsummedHours))

        var checkRemainLeave = objIndex[0].totalHours - objIndex[0].totalConsummedHours;
        for (let a = i + 1; a < this.dailyActivityForm.length + 1; a++) {
            if (a != i) {

                if (checkRemainLeave < perLeave) {
                    ((this.dailyActivityForm.at(i) as FormGroup).get('entryDateTime').patchValue('', { onlySelf: true }));
                    ((this.dailyActivityForm.at(i) as FormGroup).get('isError').patchValue(true, { onlySelf: true }));
                    // this.calculateLeave();

                    var objLeave = this.jobLeavedetailList.filter(x => x.jobLeaveId == this.selectedLeaveObj.jobLeaveId);
                    console.log(totalLeavs + ":: " + (objLeave[0].totalHours - objLeave[0].totalConsummedHours))
                    var objIndexv2 = this.jobLeavedetailList.findIndex(x => x.jobLeaveId == this.selectedLeaveObj.jobLeaveId);

                    if (objIndexv2 != -1) {
                        if (objIndexv2 != undefined) {
                            if (this.jobLeavedetailList[objIndexv2].totalConsummedHours > 0) {
                                this.calculateLeave();
                                this.timesheetDetailsByIdData.timeSheetDailyActivityDto.totalLeave = Number((this.timesheetDetailsByIdData.timeSheetDailyActivityDto.totalLeave - this.jobLeavedetailList[objIndexv2].tempTotal).toFixed(1));
                                this.jobLeavedetailList[objIndexv2].tempTotal = 0;
                                this.jobLeavedetailList[objIndexv2].totalConsummedHours = this.jobLeavedetailList[objIndexv2].tempTotal;
                            }
                        }
                    }

                } else {
                    ((this.dailyActivityForm.at(i) as FormGroup).get('isError').patchValue(false, { onlySelf: true }));
                    this.calculateLeave();
                    var objIndexv1 = this.jobLeavedetailList.findIndex(x => x.jobLeaveId == this.selectedLeaveObj.jobLeaveId);
                    if (objIndexv1 != -1) {
                        if (objIndexv1 != undefined) {

                            this.jobLeavedetailList[objIndexv1].tempTotal = this.jobLeavedetailList[objIndexv1].tempTotal == undefined ? 0 : this.jobLeavedetailList[objIndexv1].tempTotal;
                            this.jobLeavedetailList[objIndexv1].tempTotal += Number(perLeave.toFixed(2));
                            this.jobLeavedetailList[objIndexv1].totalConsummedHours = this.jobLeavedetailList[objIndexv1].tempTotal;
                            this.isLocalLeave = false;
                        }
                    }
                }
            }
        }

    }
    // End hours screen



    ShowTitle(typeId): string {

        switch ((typeId)) {
            case 56:
                return "Time In";
            case 57:
                return "Time Out";
            case 58:
                return "Break In";
            case 59:
                return "Break Out";
            case 60:
                return "Leave In";
            case 61:
                return "Leave Out";
            default:
                return "";
        }
    }

    create(body, isGenerate = false): Observable<APIResponse<Timesheet>> {

        // const params = new HttpParams();
        // params.set("isGenerate", isGenerate);
        return this.http.post<APIResponse<Timesheet>>(this.baseUrl + this.commonEndPoint + "?isGenerate=" + isGenerate, body, { headers: this.headers });

    }
    createTimeSheetDetailActivityId(body): Observable<APIResponse<TimeSheetDetailActivityPostDto>> {

        return this.http.post<APIResponse<TimeSheetDetailActivityPostDto>>(this.baseUrl + this.commonEndPoint + '/AddTimeSheetDetailActivity', body, { headers: this.headers });

    }
    createTimeSheetDailyActivityId(body): Observable<APIResponse<timeSheetDailyActivityPostData>> {

        return this.http.post<APIResponse<timeSheetDailyActivityPostData>>(this.baseUrl + this.commonEndPoint + '/AddTimeSheetDailyActivity', body, { headers: this.headers });

    }


    saveTimeClock(timeInOutDto: timeInOutDto) {
        this.http.get<any>('https://geolocation-db.com/json/')
            .pipe(
                catchError(err => {
                    return throwError(err);
                }),
                tap(response => {

                    var osName = "Unknown";
                    if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) osName = "Windows 10";
                    console.log(response.IPv4);
                    timeInOutDto.countryCode = response.countryCode;
                    timeInOutDto.countryName = response.countryName;
                    timeInOutDto.city = response.city;
                    timeInOutDto.postal = response.postal;
                    timeInOutDto.latitude = response.latitude;
                    timeInOutDto.longitude = response.longitude;
                    timeInOutDto.iPv4 = response.iPv4;
                    timeInOutDto.state = response.state;

                    timeInOutDto.os = osName;
                    timeInOutDto.os = this._commonFunctionService.getBrowser().name;



                    this.saveClockTime(timeInOutDto);
                })
            )
    }

    saveClockTime(body): Observable<APIResponse<timeInOutDto>> {

        return this.http.post<APIResponse<timeInOutDto>>(this.baseUrl + this.commonEndPoint + '/AddTimeInOut', body, { headers: this.headers });

    }

    getAll(): Observable<APIResponse<Timesheet[]>> {
        return this.all();
    }

    getTimeSheetStatus(statusId: number): string {
        switch ((typeof statusId === 'number' ? statusId : 0)) {
            case 9:
                return statusId ? "Pendding" : "Pendding";

            case 8:
                return statusId ? "Reject" : "Reject";
            default:
                return "N?A";
        }
    }
    getWeekName(hoursWorked: HoursWorked | number, isShort = true): string {
        switch ((typeof hoursWorked === 'number' ? hoursWorked : hoursWorked.day)) {
            case 1:
                return isShort ? "M" : "Monday";
            case 2:
                return isShort ? "T" : "Tuesday";
            case 3:
                return isShort ? "W" : "Wednesday";
            case 4:
                return isShort ? "TH" : "Thursday";
            case 5:
                return isShort ? "F" : "Friday";
            case 6:
                return isShort ? "SA" : "Saturday";
            case 7:
                return isShort ? "SU" : "Sunday";
            default:
                return "";
        }
    }

}
