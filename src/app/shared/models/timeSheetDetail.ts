import { auditableEntityDto } from "./auditableEntity.interface";
import { auditableEntityClassDto } from "./auditableEntity.model";
import { JobDay } from "./job";
import { Lookup } from "./lookup";

export interface JobSalaryDto extends auditableEntityDto {
    jobSalaryId: number;
    jobId: number;
    title: string;
    salaryType?: Lookup;
    salaryTypeId: number;
    salary: number;
}


export interface JobDayDto extends auditableEntityDto {

    jobDayId: number;
    jobId: number;
    dayId?: number;
    shiftId: number | null;
    hoursPerWeek: number | null;
    hoursPerDay: number | null;
    startTime: string | null;
    endTime: string | null;
    isStartingDay: boolean;
    isWeekendDay: boolean;
    allowAutoSendApproval?: boolean,
    allowAutoCompleteTimeSheet?: boolean,


}

export class JobDto extends auditableEntityClassDto {
    jobId: number;
    applicationUserId?: any;
    organizationId: number;
    jobSalaryDto: JobSalaryDto;
    jobDayDto: JobDayDto = null;
    jobDayDtos?: JobDay[] = null;
    title?: any;
    phoneNo?: any;
    email?: any;
    detail?: any;
    startDate?: string;
    endDate?: string;
    isPublic: boolean;
    statusId: number;
    comments?: any;
    hoursPerWeek: number;
    isHolidayPaid: boolean;
    isDailyHoursRestriction: boolean;
    isHourlyLog: boolean;
    managerContactId?: any;
    allowAutoSendApproval?: boolean;
    allowAutoCompleteTimeSheet?: boolean;
    hoursPerDay?: boolean;

}

export class timeSheetDailyActivityDto extends auditableEntityClassDto {
    timeSheetDailyActivityId?: number;
    timeSheet?: any;
    timeSheetId?: number;
    workDate?: string;
    day?: any;
    dayId?: number;
    hours?: number = 0;
    perDayhours?: number = 10;
    totalLeave?: number;
    totalHours?: number;
    earning?: number;
    expense?: number;
    hoursOvertimed?: number;
    dayTypeId?: number;
    dayType?: number;

    dayTypeStatus?: string;
    typeId?: number;
    comments?: any;
    isLocked?: boolean;
    invoiceTimeSheets?: any;
    manageUser?: any;
    manageUserId?: number;
    tsStatus?: any;
    tsStatusId?: number;
    salaryRate?: number;
    timeSheetDetailActivityDtos?: timeSheetDetailActivityDto[]
}

export class timeSheetDailyActivityPostDto extends auditableEntityClassDto {
    timeSheetDailyActivityId: number;
    timeSheet?: any;
    timeSheetId?: number;
    workDate?: string;
    day?: any;
    dayId?: number;
    hours?: number = 0;
    totalHours?: number;
    earning: number;
    expense: number;
    hoursOvertimed?: number;
    dayTypeId?: number;
    dayTypeStatus?: string;
    typeId?: number;
    comments?: any;
    isLocked?: boolean;
    invoiceTimeSheets?: any;
    manageUser?: any;
    manageUserId?: number;
    tsStatus?: any;
    tsStatusId?: number;
}
export class TimeSheetDetail extends auditableEntityClassDto {
    timeSheetDetailId: number;
    timeSheetId: number;
    jobDto: JobDto;
    jobId?: any;
    task?: any;
    taskId?: any;
    isHourlyLog: boolean;
    orgUserJob?: any;
    orgUserJobId?: any;
    centralReference?: any;
    centralReferenceId?: any;
    timeSheetDailyActivityDtos: timeSheetDailyActivityDto[];
    week: number;
    hours?: number;
    expenseAmount?: number;
    leaves?: number;
    payAmount?: number;
    totalLeave?: number = 0;
    managerContactId?: number;
    emailSendCount?: number;
    tsStatus?: any;
    tsStatusId?: any;
    orgUserPosition?: any;
    orgUserPositionId?: any;
    startDate?: string;
    endDate?: string;
    name: string;
    statusId?: any;
    overtimeApproverId?: any;
    timeSheetStatus?: any;
    EmailSendToDtos: emailSendToDto[]
}

export interface timeSheetDetailActivityDto {
    timeSheetDetailActivityId: number;
    timeSheetDailyActivityId: number;
    entryDateTime: Date;
    activityTypeId: any;
    leaveTypeId?: any;
    comments?: any;
    isLeave?: boolean;
    isShowTxt?: boolean;
    isShow?: boolean;
    jobLeaveId?: number;
    perDayhours?: number;
    isSysAdded: Boolean;
    leaveId?: number;
    timeSheetDetailActivityTxt?: string;


}
export class TimeSheetDetailActivityPostDto {
    timeSheetDailyActivityId?: number;
    timeSheetDailyActivityDto: timeSheetDailyActivityDto;
    timeSheetDetailActivityDtos: timeSheetDetailActivityDto[]
}
export class timeSheetDailyActivityPostData {
    jobId?: number;
    isLeaveForm?: boolean;
    timeSheetDailyActivityDtos: timeSheetDailyActivityDto[]
}


export interface timeSheetDetailInfo extends auditableEntityDto {
    timeSheetDetailInfoId: number;
    timeSheet?: any;
    timeSheetId?: any;
    workDate: Date;
    day?: any;
    dayId?: any;
    hours: number;
    earning: number;
    expense: number;
    hoursOvertimed: number;
    typeId: number;
    comments?: any;
    isLocked: boolean;
    invoiceTimeSheets?: any;
    timeSheetDetailActivityDtos?: timeSheetDetailActivityDto[];
    manageUser?: any;
    manageUserId?: any;
    tsStatus?: any;
    tsStatusId?: any;
}

export interface emailSendToDto {
    discussionId: number;
    userId: number;
    tableEntryId: number;
    email: string;
    firstName: string;
}

export class timesheetDetailsById extends auditableEntityClassDto {

    timeSheetId: number;
    jobID: number | null;
    week: number | null;
    startDate: string | null;
    endDate: string | null;
    statusID: number | null;
    status: string;
    overtimeApproverId: any;
    overtimeApprover: string;
    timeSheetDailyActivityDto: timeSheetDailyActivityDto;
    // timeSheetDailyActivityDtoPost: timeSheetDailyActivityPostDto;
    jobSalaryDto: JobSalaryDto
    jobDayDtos: JobDayDto[]
    jobDayDto: JobDayDto;

}

export class timeSheetDailyActivityDtos extends auditableEntityClassDto {

    timeSheetId?: number;
    jobID?: number | null;
    week?: number | null;
    startDate?: string | null;
    endDate?: string | null;
    statusID?: number | null;
    status?: string;
    overtimeApproverId?: any;
    overtimeApprover?: string;
    totalLeave?: number;
    totalHours?: number;
    totalSalary?: number;
    timeSheetDailyActivityDtos?: timeSheetDailyActivityDto[];
    // timeSheetDailyActivityDtoPost: timeSheetDailyActivityPostDto;
    jobSalaryDto?: JobSalaryDto
    jobDayDtos?: JobDayDto[]
    jobDayDto?: JobDayDto;

}

