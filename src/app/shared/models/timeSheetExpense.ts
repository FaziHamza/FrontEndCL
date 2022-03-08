import { auditableEntityDto } from "./auditableEntity.interface";

export interface TimeSheetExpense extends auditableEntityDto {
    expenseId: number;
    timeSheetDailyActivityId: number;
    amount: any;
    approvedAmount?: number;
    approvedById: number;
    comments: number;
    expenseTypeId: number;
    isApproved: boolean;
    fileName: string;
    comment: any;
}



