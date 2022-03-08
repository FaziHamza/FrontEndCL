import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Job, JobDay, JobLeave, JobLeavedetail, JobOvertime, JobSalary } from "../models/job";
import { AuthenticationService } from "./authentication.service";
import { BaseApiService } from "./base-api.service";
import { APIResponse } from "../models/a-p-i-Response";
import { environment } from "../../../environments/environment";
import { JobDayDto, JobSalaryDto } from "../models/timeSheetDetail";
import { FormArray, FormGroup } from "@angular/forms";


@Injectable({ providedIn: 'root' })
export class JobService extends BaseApiService<Job> {
    commonEndPoint = 'Job';
    url = environment.serverApiUrl + "/api/";

    constructor(private _httpClient: HttpClient, public _authenticationService: AuthenticationService) {
        super(_httpClient, _authenticationService);
        // Do what you need to do starting here...
    }

    get(id: number): Observable<APIResponse<Job>> {
        return this.single(id);
    }

    getAll(): Observable<APIResponse<Job[]>> {
        return this.all();
    }
    getAllJob(): Observable<APIResponse<Job[]>> {
        debugger
        return this.http.get<APIResponse<Job[]>>(this.baseUrl + this.commonEndPoint + "/Get", {
            headers: this.headers
        });
    }
    getJobByOrgId(id: number): Observable<APIResponse<Job[]>> {
        debugger
        let params = new HttpParams()

        if (id) {
            params = params.set('id', id);
        }
        return this.http.get<APIResponse<Job[]>>(this.baseUrl + this.commonEndPoint + "/GetJobDataByIdJobDto?id=" + id, {
            headers: this.headers
        });
    }
    getPreviosuLeaveDetail(id: number, year: number): Observable<APIResponse<JobLeavedetail[]>> {
        debugger
        let params = new HttpParams()

        if (year) {
            params = params.set('id', id);
            params = params.set('year', year);


        }
        return this.http.get<APIResponse<JobLeavedetail[]>>(this.baseUrl + this.commonEndPoint + "/GetJobLeavedetail?id=" + id + "&year=" + year, {
            headers: this.headers
        });
    }

    getJobLeaveLookupList(id: number): Observable<APIResponse<JobLeavedetail[]>> {
        debugger
        let params = new HttpParams()

        if (id) {
            params = params.set('id', id);
        }
        return this.http.get<APIResponse<JobLeavedetail[]>>(this.baseUrl + this.commonEndPoint + "/GetJobLeaveLookupList?id=" + id, {
            headers: this.headers
        });
    }

    getPreviosuLeaveDetailByTimeSheet(id: number, year: number): Observable<APIResponse<JobLeavedetail[]>> {
        debugger
        let params = new HttpParams()

        if (year) {
            params = params.set('id', id);
            params = params.set('year', year);
        }
        return this.http.get<APIResponse<JobLeavedetail[]>>(this.baseUrl + this.commonEndPoint + "/GetTimeSheetLeaveDetailList?id=" + id + "&year=" + year, {
            headers: this.headers
        });
    }
    getLeaveDetailByTimeSheet(id: number, timeSheetId: number, year: number): Observable<APIResponse<JobLeavedetail[]>> {
        debugger
        let params = new HttpParams()

        if (year) {
            params = params.set('id', id);
            params = params.set('year', year);
            params = params.set('timeSheetId', year);

        }
        return this.http.get<APIResponse<JobLeavedetail[]>>(this.baseUrl + this.commonEndPoint + "/GetTimeSheetLeaveDetailList?id=" + id + "&timeSheetId=" + timeSheetId + "&year=" + year, {
            headers: this.headers
        });
    }


    // create(orgModel: Job): Observable<APIResponse<Job>> {
    //     return this.post(orgModel);
    // }
    create(jobModel: Job): Observable<APIResponse<Job>> {
        return this.http.post<APIResponse<Job>>(this.url + this.commonEndPoint + "/AddJob", jobModel, {
            headers: this.headers
        });
    }
    update(jobModel: Job): Observable<APIResponse<Job>> {
        debugger
        return this.http.put<APIResponse<Job>>(this.url + this.commonEndPoint + "/UpadteJob", jobModel, {
            headers: this.headers
        });
    }

    // update(orgModel: Job): Observable<APIResponse<Job>> {
    //     return this.put(orgModel);
    // }

    createJobSalary(model: JobSalary): Observable<APIResponse<JobSalary>> {
        debugger
        return this.http.post<APIResponse<JobSalary>>(this.url + this.commonEndPoint + "/JobSalary", model, {
            headers: this.headers
        });
    }
    // deletSalary(id: number, httpParams?: HttpParams): Observable<APIResponse<boolean>> {
    //     return this.http.delete<APIResponse<boolean>>(this.baseUrl + this.commonEndPoint + "/JobSalaryDelete", {
    //         params: {id: id},
    //         headers: this.headers
    //     });
    // }

    salaryDeleteIds: any = [];
    createJobDay(jobDays: JobDay[]): Observable<APIResponse<JobDay[]>> {
        let model = { jobDays: jobDays };
        return this.http.post<APIResponse<JobDay[]>>(this.url + this.commonEndPoint + "/JobDay", model, {
            headers: this.headers
        });
    }

    createJobLeaves(jobLeaves: JobLeave[]): Observable<APIResponse<JobLeave[]>> {
        let model = { jobLeaves: jobLeaves };
        return this.http.post<APIResponse<JobLeave[]>>(this.url + this.commonEndPoint + "/JobLeave", model, {
            headers: this.headers
        });
    }

    createJobOvertime(jobOvertime: JobOvertime): Observable<APIResponse<JobOvertime>> {
        return this.http.post<APIResponse<JobOvertime>>(this.url + this.commonEndPoint + "/JobOvertime", jobOvertime, {
            headers: this.headers
        });
    }
    jobSalaryList: JobSalaryDto[] = [];
    IsShowTable: boolean = false;
    IsShowSalary: boolean = false;
    IsShowJobError: boolean = false;
    jobErrorList: any[] = [];



    week = {
        weekId: 1,
        days: [
            { dayId: 1, id: 1, name: 'Monday', startDate: null, endDate: null, isStartingDay: true, isStartError: false, isEndError: false, isWeekendDay: false, IsDayMax: false },
            { dayId: 2, id: 2, name: 'Tuesday', startDate: null, endDate: null, isStartingDay: false, isStartError: false, isEndError: false, isWeekendDay: false, IsDayMax: false },
            { dayId: 3, id: 3, name: 'Wednesday', startDate: null, endDate: null, isStartingDay: false, isStartError: false, isEndError: false, isWeekendDay: false, IsDayMax: false },
            { dayId: 4, id: 4, name: 'Thursday', startDate: null, endDate: null, isStartingDay: false, isStartError: false, isEndError: false, isWeekendDay: false, IsDayMax: false },
            { dayId: 5, id: 5, name: 'Friday', startDate: null, endDate: null, isStartingDay: false, isStartError: false, isEndError: false, isWeekendDay: false, IsDayMax: false },
            { dayId: 6, id: 6, name: 'Saturday', startDate: null, endDate: null, isStartingDay: false, isStartError: false, isEndError: false, isWeekendDay: false, IsDayMax: false },
            { dayId: 7, id: 7, name: 'Sunday', startDate: null, endDate: null, isStartingDay: false, isStartError: false, isEndError: false, isWeekendDay: false, IsDayMax: false },
        ]
    };


    getDaysOfWeek(week) {
        // return this.daysOfWeek.find(f => f.weekId === week.id)?.days
        return this.week.days
    }

    // add Single 
    // getJobDetailData
    getJobDetailData(organizationId: string): Observable<APIResponse<Job[]>> {

        return this.http.get<APIResponse<Job[]>>(this.baseUrl + this.commonEndPoint + "/getJobDetailData",
            {

                headers: this.headers
            });
    }
    getJobSalary(jobId: number): Observable<APIResponse<JobSalaryDto[]>> {
        return this.http.get<APIResponse<JobSalaryDto[]>>(this.baseUrl + this.commonEndPoint + "/GetJobSalary?jobId=" + jobId,
            {
                headers: this.headers
            });
    }
    getJobDay(jobId: number): Observable<APIResponse<JobDayDto[]>> {
        return this.http.get<APIResponse<JobDayDto[]>>(this.baseUrl + this.commonEndPoint + "/GetJobDay?jobId=" + jobId,
            {
                headers: this.headers
            });
    }
    getJobLeave(jobId: number): Observable<APIResponse<JobLeave[]>> {
        return this.http.get<APIResponse<JobLeave[]>>(this.baseUrl + this.commonEndPoint + "/GetJobLeave?jobId=" + jobId,
            {
                headers: this.headers
            });
    }
    getJobOverTime(jobId: number): Observable<APIResponse<JobOvertime>> {
        return this.http.get<APIResponse<JobOvertime>>(this.baseUrl + this.commonEndPoint + "/GetJobOverTime?jobId=" + jobId,
            {
                headers: this.headers
            });
    }


}
