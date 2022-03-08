import { auditableEntityDto } from "./auditableEntity.interface";

    export interface timeSheetDetailActivityDto extends auditableEntityDto {
        timeSheetDetailActivityId: number;
        timeSheetDailyActivity?: any;
        timeSheetDailyActivityId: number;
        entryDateTime: Date;
        activityType?: any;
        activityTypeId: number;
        jobLeaveId?: any;
        comments?: any;
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
        timeSheetDetailActivityDtos: timeSheetDetailActivityDto[];
        manageUser?: any;
        manageUserId?: any;
        tsStatus?: any;
        tsStatusId?: any;
    }

