import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FullCalendarModule} from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import {ReminderModule} from "./commons/reminder/reminder.module";


@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: []
})
export class SharedModule {
}

