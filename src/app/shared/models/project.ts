import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { ApplicationUser } from "./applicationUser";
import { Lookup } from "./lookup";

export interface project {
    projectId: number;
    user?: ApplicationUser;
    userId?: number | null;
    name?: string;
    description?: string;
    projectNo?: string;
    isDefault?:boolean;
    projectStartDate?: Date | NgbDate | string;
    projectEndDate?: Date  | string;
    statusId?: number | null;
    isNotificationOn?: boolean;
    isNotifyUserByEmail?: boolean;
    projectPlannedStartDate?: Date  | string;
    projectPlannedEndDate?: Date | NgbDate | string;
    isPublic?: boolean;
    version?: string;
    isActive?: boolean | null;
    createdDate?: string;
    modifiedDate?: string | null;
    createdById?: number | null;
    modifiedById?: number | null;
    priorityId?: number | null;
    taskNo?: number | null;
    subTaskId?: number | null;
    jobId?: number | null;
    priorityType?:Lookup
}