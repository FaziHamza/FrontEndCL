import {Organization} from "./organization";
import {Timesheet} from "./timesheet";
import {Job} from "./job";
import {Contact} from "./contact";

export interface SetupAdditionalData {
    organization?: Organization;
    timeSheets?: Timesheet[];
    contacts?: Contact[];
    accountType?: string;
    job?: Job;
}
