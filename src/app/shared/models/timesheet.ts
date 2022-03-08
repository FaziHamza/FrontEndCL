import { auditableEntityDto } from "./auditableEntity.interface";

export interface Timesheet extends auditableEntityDto {
    timesheetId?: number;
    jobId?: number;
    task?: Task;
    taskId?: number;
    orgUserJobId?: number;
    centralReferenceId?: number;
    week?: number;
    tsStatusId?: number;
    orgUserPositionId?: number;
    startDate?: Date;
    endDate?: Date;
    name?: string;
    statusId?: number;
    overtimeApproverId?: number;
}
export class timeInOutDto {
    timeInOutId?: number;
    userId?: number;
    orgId?: number;
    jobId?: number;
    isAddedTimeSheetDetail?: boolean;
    date?: string;
    status?: string;
    isActive?: boolean | null;
    jobLeaveId?: number | null;

    countryCode: string;
    countryName: string;
    city: string;
    postal: string;
    latitude: number;
    longitude: number;
    iPv4: string;
    state: string;
    os: string;
    browser: string;
    country_name: string;
    country_code: string;



}
