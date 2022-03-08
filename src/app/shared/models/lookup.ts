import { auditableEntityDto } from "./auditableEntity.interface";

export interface Lookup  extends auditableEntityDto{
    lookupId?: number;
    category?: string;
    subCategory?: string;
    description?: string;
    lookupValue?: number;
    comment?: string;
    order?: number;
    isValid?: boolean;
    disabled?: boolean;
}

export interface ContactTypeLookup extends Lookup {
    countOfContacts: number;
}

