export interface SetupScreenStateDto {
    setupScreenStateId: number;
    userId: number;
    orgId: number | null;
    section: string;
    data: string;
    status: string;
    isCurrent: boolean;
    createdDate: string;
    screenStatus:string;
}