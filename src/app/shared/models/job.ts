import {Organization, OrganizationConfigurationDto} from "./organization";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {Lookup} from "./lookup";
import { auditableEntityDto } from "./auditableEntity.interface";

export interface Job  extends auditableEntityDto{
    jobId: number;
    phoneNo?: string;
    email?: string;
    applicationUserId?: number | null;
    organizationId?: number;
    organization?: Organization | null;
    title?: string;
    detail?: string;
    startDate?: Date | NgbDate | string;
    endDate?: Date | NgbDate | string;
    statusId?: number;
    hoursPerWeek?: number;
    isHolidayPaid?: boolean;
    isDailyHoursRestriction?: boolean;
    isPublic?: boolean;
    skills?: string;
    jobSalaryDtos?:JobSalary[] ,
    jobSalaryDto?:JobSalary ,
    jobOvertimeDto?:JobOvertime ,
    jobDayDtos ?:JobDay[],
    jobLeaveDtos ?:JobLeave[],
    organizationConfigurationDto?:OrganizationConfigurationDto,
    shiftType ?:Lookup,
    shiftId?:0,
    yearStart?:0,
    allowAutoSendApproval?:boolean,
    allowAutoCompleteTimeSheet?:boolean,
    hoursPerDay?:boolean,




}

export interface JobSalary {
    jobSalaryId?: number;
    job?: Job;
    jobId?: number;
    title?: string;
    salaryType ?: Lookup;
    salaryTypeId ?: number;
    salary ?: number;
    isActive ?: boolean;
    createdById?: number;
    createdDate?: Date;
    modifiedById?: number;
    modifiedDate?: Date;
    ids?:[];
}
// export interface JobSalaryDto {
//     id: number;
//     jobId ?: number;
//     salaryTypeId ?: number;
//     salary ?: number;
//     isActive ?: boolean;
//     createdById ?: number;
// }

export  interface JobDay{
    jobDayId : number;
    jobId?: number;
    dayId?: number;
    startTime?: Date | string;
    endTime?: Date | string;
    createdDate?: Date;
    modifiedDate?: Date;
    isActive?: boolean;
    createdById?: number;
    modifiedById?: number;
    isStartingDay?: boolean;
    isWeekendDay?: boolean;
}

export interface JobLeave{
    jobLeaveId?: number;
    jobId?: number;
    description?: string;
    hours?: string;
    isActive?: boolean;
    createdById?: number;
    createdDate?: Date;
    modifiedById?: number;
    modifiedDate?: Date;
    consumed ?:string;
    comment ?:string;
    Year ?:string;
    Remaining ?:string
}

export interface JobOvertime{
    jobOvertimeId: number;
    jobId: number;
    overtimeType: Lookup;
    overtimeTypeId: number;
    hours: number;
    isApprovalRequired: boolean;
    perDayHoursLimit: number;
    overtimeRate: number;
    isActive?: boolean;
    createdById: number;
    createdDate: Date;
    modifiedById: number;
    modifiedDate: Date;
}
export class JobLeavedetail
 {
    date: string;
    jobLeaveId: number;
    jobId: number;
    description: string;
    year: number;
    totalConsumed: number;
    totalHours: number;
    comments:string;
    totalConsummedHours :number =0;
    tempTotal :number =0;

}
