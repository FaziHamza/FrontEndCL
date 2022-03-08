import { Lookup } from "./lookup";

export interface skillCategory {
    skillCategoryId?: number;
    name?: string;
    refIndustry?: Lookup;
    refIndustryId?: number | null;
    createdDate?: string;
    isActive?: boolean | null;
    modifiedDate?: string | null;
    createdById?: number | null;
    modifiedById?: number | null;
}
export interface skillCategoryDto {
    skillCategoryId?: number;
    name?: string;
    refIndustry?: Lookup;
    refIndustryId?: number | null;
    createdDate?: string;
    isActive?: boolean | null;
    modifiedDate?: string | null;
    createdById?: number | null;
    modifiedById?: number | null;
}