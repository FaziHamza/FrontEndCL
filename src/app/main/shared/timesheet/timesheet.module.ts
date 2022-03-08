import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TimesheetRoutingModule} from './timesheet-routing.module';
import {TimesheetExpensesComponent} from "./timesheet-expenses/timesheet-expenses.component";
import {TimesheetHourlyActivityComponent} from "./timesheet-hourly-activity/timesheet-hourly-activity.component";
import {TimesheetDailyActivityComponent} from './timesheet-daily-activity/timesheet-daily-activity.component';
import {TimesheetComponent} from './timesheet.component';
import {CoreCommonModule} from "../../../../@core/common.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {TopMenuModule} from "../../../layout/components/top-menu/top-menu.module";
import {CoreCardModule} from "../../../../@core/components/core-card/core-card.module";
import {TimesheetDashboardComponent} from './timesheet-dashboard/timesheet-dashboard.component';
import {TimesheetListComponent} from './timesheet-list/timesheet-list.component';
import {DragulaModule, DragulaService} from "ng2-dragula";
import { TimesheetDailyActivityAddEditComponent } from './timesheet-daily-activity-add-edit/timesheet-daily-activity-add-edit.component';
import { AddEditLeaveComponent } from './add-edit-leave/add-edit-leave.component';
import { BlockUIModule } from 'ng-block-ui';


@NgModule({
    declarations: [
        TimesheetExpensesComponent,
        TimesheetHourlyActivityComponent,
        TimesheetDailyActivityComponent,
        TimesheetComponent,
        TimesheetDashboardComponent,
        TimesheetListComponent,
        TimesheetDailyActivityAddEditComponent,
        AddEditLeaveComponent
    ],
    imports: [
        CommonModule,
        TimesheetRoutingModule,
        CoreCommonModule,
        CoreCardModule,
        NgbModule,
        NgSelectModule,
        BlockUIModule,
        TopMenuModule,
        DragulaModule
    ]
})
export class TimesheetModule {
}
