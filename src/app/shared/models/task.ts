import { Lookup } from "./lookup";
import { project } from "./project";

export class task {
    taskId: number;
    project?: project;
    projectId?: number | null;
    assignedToUserId?: number | null;
    userId?: number | null;
    details?: string;
    taskTypeId?: number | null;
    taskStatusId?: number | null;
    isNotificationOn?: boolean=false;
    startDate?: string;
    endDate?: string;
    hoursAllocated?: number;
    title?: string;
    isActive?: boolean | null;
    createdDate?: string;
    modifiedDate?: string | null;
    createdById?: number | null;
    modifiedById?: number | null;
    priorityId?: number | null;
    taskNo?: number | null;
    priorityType?:Lookup;
    taskStatus?:Lookup;
    taskType?:Lookup;

}