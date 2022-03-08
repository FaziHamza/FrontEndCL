export class APIResponse<T> {
    public successFlag: boolean;
    public totalCount: number;
    public data: T;
    public message: string;
}

export class MiscAPIResponse<T, TT> {
    public successFlag: boolean;
    public totalCount: number;
    public data: T;
    public miscData: TT;
    public message: string;
}
