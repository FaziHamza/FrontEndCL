import {Lookup} from "./lookup";
import {Contact} from "./contact";
import { auditableEntityDto } from "./auditableEntity.interface";

export interface Group extends auditableEntityDto{
    groupId?: number;
    name?: string;
    description?: string;
    groupType?: Lookup | null;
    groupTypeId?: number;
    isPublic?: boolean;
    organizationId?: string;
    isPerm?: boolean;
    groupMembers?: GroupMember[];
    centralReferenceId?: number;
    orgDepartmentId?: number;
}

export interface GroupMember {
    groupMemberId?: number;
    contact?: Contact;
    contactId?: number;
    group?: Group;
    groupId?: number;
    contactType?: Lookup | null;
    contactTypeId?: number;
    isActive?: boolean;
    createdDate?: Date;
    modifiedDate?: Date;
    createdById?: number;
    modifiedById?: number;
}
