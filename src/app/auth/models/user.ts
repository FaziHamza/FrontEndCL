import {Role} from './role';

export class User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    role: Role;
    isEmailVerified?: boolean;
    authToken?: string;
    organizationId?: number;
    organizationName?: string;
    isInitialSetupDone?: boolean;
}
