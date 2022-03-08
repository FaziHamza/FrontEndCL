import {MaritalStatusType} from "./maritalStatusType";
import {GenderType} from "./genderType";
import { auditableEntityDto } from "./auditableEntity.interface";

export interface ApplicationUser extends auditableEntityDto {
    id?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    address?: string;
    profilePic?: string;
    organizationSimplifiedId?: string;
    dateOfBirth?: string;
    contactNo?: string;
    genderTypeId?: GenderType;
    maritalStatusTypeId?: MaritalStatusType;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    permission?: string;
}
