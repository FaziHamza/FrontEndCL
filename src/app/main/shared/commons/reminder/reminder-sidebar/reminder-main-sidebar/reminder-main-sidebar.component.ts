import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';

import {ReminderService} from "../../reminder.service";

@Component({
    selector: 'app-calendar-main-sidebar',
    templateUrl: './reminder-main-sidebar.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ReminderMainSidebarComponent implements OnInit {
    // Public
    public calendarRef = [];
    public tempRef = [];
    public checkAll = true;

    /**
     * Constructor
     *
     * @param {CoreSidebarService} _coreSidebarService
     * @param {ReminderService} reminderService
     */
    constructor(private _coreSidebarService: CoreSidebarService, private reminderService: ReminderService) {
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle Event Sidebar
     */
    toggleEventSidebar() {
        this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();
    }

    /**
     * Add Event
     *
     */
    AddEvent() {
        this.toggleEventSidebar();
        this._coreSidebarService.getSidebarRegistry('calendar-main-sidebar').toggleOpen();
        this.reminderService.createNewEvent();
    }

    /**
     * If all checkbox are checked : returns TRUE
     */
    allChecked() {
        return this.calendarRef.every(v => v.checked === true);
    }

    /**
     * Checkbox Change
     *
     * @param event
     * @param id
     */
    checkboxChange(event, id) {
        const index = this.calendarRef.findIndex(r => {
            if (r.id === id) {
                return id;
            }
        });
        this.calendarRef[index].checked = event.target.checked;
        this.reminderService.calendarUpdate(this.calendarRef);
        this.checkAll = this.allChecked();
    }

    /**
     * Toggle All Checkbox
     *
     * @param event
     */
    toggleCheckboxAll(event) {
        this.checkAll = event.target.checked;
        if (this.checkAll) {
            this.calendarRef.map(res => {
                res.checked = true;
            });
        } else {
            this.calendarRef.map(res => {
                res.checked = false;
            });
        }
        this.reminderService.calendarUpdate(this.calendarRef);
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to Calendar changes
        this.reminderService.onCalendarChange.subscribe(res => {
            this.calendarRef = res;
        });
    }
}
