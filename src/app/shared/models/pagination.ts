export interface Pagination {
    page?: number;
    pageSize?: number;
    total?: number;
    pages?: number;
    search?: string | null;
    internal?: boolean;
    organizationId?: number;
    typeId?: number;
}
