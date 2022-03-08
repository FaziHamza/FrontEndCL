import { auditableEntityClassDto } from "./models/auditableEntity.model";

export class getContactDto extends auditableEntityClassDto {
    contactId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    title: string;
    detail: string;
    phone: string;
    email: string;
    contactTypeId: number;
    orgJobPostId: number;
    isContactVerified: boolean;
    isPublic: boolean;
    isValid: boolean;
    isReference: boolean;
    centralReferenceId: any;
    orgDepartmentId: any;
    organizationId: any;
    groupName: string;
    groupId: number;
    serachFeild: string;
    ContactType: string;
    group: string;
    phoneList:string;
    emailList:string;
    organizationName:string;
    groupIds :[];
    groupNames :[];

}
export class PhoneNumber {
    type: string;
    phone: string;
    isDefault: boolean;
}

export class Email {
    type: string;
    email: string;
    isDefault: boolean;
}

export class ContactPost {
    id: string;
    organizationId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    contactType: string;
    title: string;
    details: string;
    phoneNumbers: PhoneNumber[];
    emails: Email[];
}
