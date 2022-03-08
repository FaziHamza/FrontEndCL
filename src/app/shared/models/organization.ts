import { ApplicationUser } from "./applicationUser";
import { auditableEntityDto } from "./auditableEntity.interface";
import { Lookup } from "./lookup";
import { JobDto } from "./timeSheetDetail";

export interface Organization extends auditableEntityDto{
    organizationId?: number;
    simplifiedId?: string;
    name?: string;
    website?: string;
    email?: string;
    emailVerified?: boolean;
    representative?: ApplicationUser;
    representativeId?: number;
    organizationConfigurationDtos?: OrganizationConfigurationDto[];
    jobDtos?: JobDto[];
    jobDto?: JobDto;
    organizationConfigurationDto?: OrganizationConfigurationDto;
}

export interface OrganizationConfigurationDto {
    organizationConfigurationId: number;
    organization: Organization;
    organizationId: number | null;
    weekStartDay: number;
    isHourlyLog: boolean;
    startTime: string;
    endTime: string;
    isActive: boolean;
    shiftId: number | null;
    shiftType: Lookup;
    weekDay: Lookup;
    fiscalYearEnd :number;
}
export interface OrgizationConfiguzartionLookup {
    day ?: string;
    sTime?: string;
    eTime?: string;
    shift1?: string;
    shift2?: string;
}