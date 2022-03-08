import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-timesheet-list',
    templateUrl: './timesheet-list.component.html',
    styleUrls: ['./timesheet-list.component.scss']
})
export class TimesheetListComponent implements OnInit {

    viewType: 'list' | 'grid' = 'grid';

    availableTimeSheets: any[] = [
        {
            week: 1,
            startDate: '2021-08-24T10:48:10Z',
            endDate: '2021-08-27T10:48:10Z'
        }, {
            week: 2,
            startDate: '2021-08-24T10:48:10Z',
            endDate: '2021-08-27T10:48:10Z'
        }, {
            week: 3,
            startDate: '2021-08-24T10:48:10Z',
            endDate: '2021-08-27T10:48:10Z'
        }, {
            week: 4,
            startDate: '2021-08-24T10:48:10Z',
            endDate: '2021-08-27T10:48:10Z'
        },
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

}
