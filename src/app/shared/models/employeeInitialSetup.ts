export interface EmployeeInitialSetup {
    employeeInitialSetupId?: number;
    userId?: number;
    orgId?: number;
    data?: any;
    section?: string;
    status?: string;
    screenStatus?:string;
    isCurrent?: boolean;
    createdDate?: Date;
}
export interface EmployeeInitialSetupListDto {
    EmployeeInitialSetup :EmployeeInitialSetup[]

}
