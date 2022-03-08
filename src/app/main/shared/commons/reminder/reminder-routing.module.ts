import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReminderComponent} from "./reminder.component";
import {ReminderService} from "./reminder.service";

const routes: Routes = [
    {
        path: '',
        component: ReminderComponent,
        data: {hasTopMenu: true},
        resolve: {
            data: ReminderService
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReminderRoutingModule {
}
