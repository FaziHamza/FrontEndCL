export interface SampleTimeSheet {
    id: number;
    week: string;
    date: string;
    startDate?: string;
    endDate?: string;
    hours?: number;
    payAmount?: number;
    expenseAmount?: number;
    hoursWorked?: HoursWorked[];
    invoice?: number;
    status: string;
    allowOvertime: boolean;
    emails?: string[];
}

export interface HoursWorked {
    day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    hours: number;
    isLeave: boolean;
    isAbsent: boolean;
    isOvertime: boolean;
    isWeekEnd: boolean,

}
