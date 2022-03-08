import {Lookup} from "./lookup";
import {GroupMember} from "./group";
import {ContactDetail} from "./contactDetail";
import { auditableEntityDto } from "./auditableEntity.interface";

export interface Contact extends auditableEntityDto{
    contactId?: number;
    receiverUserId?: number;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    title?: string;
    detail?: string;
    phone?: string;
    email?: string;
    emails?: any[];
    phoneNumbers?: any[];
    groupMembers?: GroupMember[];
    contactDetails?: ContactDetail[];
    contactType?: Lookup | null;
    contactTypeId?: number;
    orgJobPostId?: number;
    isContactVerified?: boolean;
    isPublic?: boolean;
    isValid?: boolean;
    isReference?: boolean;
    centralReferenceId?: number;
    organizationId?: number;
    jobId?: number;

}
