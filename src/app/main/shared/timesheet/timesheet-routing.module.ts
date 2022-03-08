import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimesheetExpensesComponent } from "./timesheet-expenses/timesheet-expenses.component";
import { AuthGuard } from "../../../auth/helpers";
import { TimesheetHourlyActivityComponent } from "./timesheet-hourly-activity/timesheet-hourly-activity.component";
import { TimesheetDailyActivityComponent } from "./timesheet-daily-activity/timesheet-daily-activity.component";
import { TimesheetComponent } from "./timesheet.component";
import { TimesheetDashboardComponent } from "./timesheet-dashboard/timesheet-dashboard.component";
import { TimesheetListComponent } from "./timesheet-list/timesheet-list.component";

const routes: Routes = [{
    path: '',
    component: TimesheetComponent,
    data: { hasTopMenu: true },
    children:
        [
            {
                path: '',
                component: TimesheetDashboardComponent,
            },
            {
                path: 'list',
                component: TimesheetListComponent,
            }, {
                path: 'daily-activity',
                component: TimesheetDailyActivityComponent,
                children: [
                    {
                        path: ':week',
                        component: TimesheetDailyActivityComponent,
                        children: [
                            {
                                path: ':day', component: TimesheetDailyActivityComponent,
                                children: [
                                    {
                                        path: ':timeSheet',
                                        component: TimesheetDailyActivityComponent,
                                    }
                                ]
                                
                            }
                        ]
                    }
                ]
            }, {
                path: 'expenses',
                component: TimesheetExpensesComponent,
                children: [
                    {
                        path: ':week', component: TimesheetExpensesComponent,
                    }
                ],
            }, {
                path: 'hourly-activity',
                component: TimesheetHourlyActivityComponent,
                children: [
                    {
                        path: ':week',
                        component: TimesheetHourlyActivityComponent,
                        children: [
                            {
                                path: ':day', component: TimesheetHourlyActivityComponent,
                                children: [
                                    {
                                        path: ':timeSheet',
                                        component: TimesheetHourlyActivityComponent,
                                    }
                                ]
                                
                            }
                        ]
                    }
                ]
            }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TimesheetRoutingModule {
}
