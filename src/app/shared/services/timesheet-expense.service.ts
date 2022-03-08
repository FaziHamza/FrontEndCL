import { Injectable } from '@angular/core';
import { BaseApiService } from "./base-api.service";
import { Observable } from "rxjs";
import { APIResponse, MiscAPIResponse } from "../models/a-p-i-Response";
import { environment } from "../../../environments/environment";
import { TimeSheetExpense } from '../models/timeSheetExpense';
@Injectable({
    providedIn: 'root'
})
export class TimesheetExpenseService extends BaseApiService<TimeSheetExpense> {
    url = environment.serverApiUrl + "/api/";
    

    getTimeSheetExpense(): Observable<APIResponse<TimeSheetExpense[]>> {
        return this.http.get<APIResponse<TimeSheetExpense[]>>(this.url + this.commonEndPoint + "/GetExpense", {
            headers: this.headers
        });
    }
    
    deleteTimeSheetExpense(id: number): Observable<APIResponse<boolean>> {
        return this.delete(id);
    }
    
    saveTimeSheetExpense(expense: TimeSheetExpense): Observable<APIResponse<TimeSheetExpense>> {
        return this.post(expense);
    }
}
