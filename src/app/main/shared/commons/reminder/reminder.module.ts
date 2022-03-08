import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReminderRoutingModule} from './reminder-routing.module';
import {ReminderService} from "./reminder.service";
import {ReminderComponent} from "./reminder.component";
import {ReminderMainSidebarComponent} from "./reminder-sidebar/reminder-main-sidebar/reminder-main-sidebar.component";
import {ReminderEventSidebarComponent} from "./reminder-sidebar/reminder-event-sidebar/reminder-event-sidebar.component";
import {CoreSidebarModule} from "../../../../../@core/components";
import {FullCalendarModule} from "@fullcalendar/angular";
import {CoreCommonModule} from "../../../../../@core/common.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

@NgModule({
    declarations: [ReminderComponent, ReminderMainSidebarComponent, ReminderEventSidebarComponent],
    imports: [
        CommonModule,
        FullCalendarModule,
        ReminderRoutingModule,
        CoreSidebarModule,
        CoreCommonModule,
        FormsModule,
        NgSelectModule,
        Ng2FlatpickrModule,
        NgbModule
    ],
    providers: [ReminderService]

})
export class ReminderModule {
}
