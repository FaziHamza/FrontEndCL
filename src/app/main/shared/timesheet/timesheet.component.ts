import {Component, OnInit} from '@angular/core';
import {CoreConfigService} from "../../../../@core/services/config.service";
import {ContentHeader} from "../../../layout/components/content-header/content-header.component";
import {CoreMenuItem} from "../../../../@core/types";

@Component({
    selector: 'app-timesheet',
    templateUrl: './timesheet.component.html',
    styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
    public contentHeader: ContentHeader = {
        headerTitle: 'Timesheet',
        breadcrumb: null,
        actionButton: false
    };
    menuItems: CoreMenuItem[] = [
        {id: '1', url: '/timesheet', title: 'Timesheet', type: 'item', icon: 'home'},
        {id: '2', url: '/timesheet/list', title: 'List', type: 'item', icon: 'list'},
        {id: '3', url: '/timesheet/daily-activity', title: 'Daily Activity', type: 'item', icon: 'calendar'},
        {id: '4', url: '/timesheet/expenses', title: 'Expenses', type: 'item', icon: 'dollar-sign'},
        {id: '5', url: '/timesheet/hourly-activity', title: 'Hourly Activity', type: 'item', icon: 'clock'},
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

    onNavigationChange(mi: CoreMenuItem) {
        this.contentHeader.headerTitle = mi.title;
    }
}
