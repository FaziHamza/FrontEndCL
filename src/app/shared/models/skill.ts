import { skillCategory, skillCategoryDto } from "./skillCategory";

export interface skill {
    skillId: number;
    name: string;
    skillCategory: skillCategoryDto;
    skillCategoryId: number | null;
    createdDate: string;
    isActive: boolean | null;
    modifiedDate: string | null;
    createdById: number | null;
    modifiedById: number | null;
}

export interface skillDto {
    skillId: number;
    name: string;
    skillCategory: skillCategory;
    skillCategoryId: number | null;
    createdDate: string;
    isActive: boolean | null;
    modifiedDate: string | null;
    createdById: number | null;
    modifiedById: number | null;
}