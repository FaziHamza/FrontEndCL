import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FlatpickrOptions, Ng2FlatpickrComponent} from "ng2-flatpickr";

@Component({
    selector: 'app-invoice-sample',
    templateUrl: './invoice-sample.component.html',
    styleUrls: ['./invoice-sample.component.scss']
})
export class InvoiceSampleComponent implements OnInit {

    // @ViewChild('endDateComp') endDateC: Ng2FlatpickrComponent;

    public startDateOptions: FlatpickrOptions = {
        altInputClass: 'hidden',
        inline: true,
        wrap: false,
        "disable": [
            function (date) {
                // return true to disable
                return (date.getDay() === 0 || date.getDay() === 6 || date < Date.now());

            }
        ],
    };
    public endDateOptions: FlatpickrOptions = {
        altInputClass: 'hidden',
        inline: true,
        wrap: false,
    };

    startDate: Date[];
    endDate: Date[];
    contentHeader: any;
    availableInvoices = [
        {
            number: "#000100010",
            dated: '2021-08-31T10:48:10Z',
            startDated: '2021-08-24T10:48:10Z',
            endDated: '2021-08-30T10:48:10Z',
            hoursWorked: '10:45',
            amount: 12550.98,
            emails: ['someone@some.com', 'anotherperson@gmail.com']
        }];

    constructor() {
    }

    ngOnInit(): void {
        // this.configEndDate(endDateComp);
        this.contentHeader = {
            headerTitle: 'Invoices',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: []
            }
        }
    }

    configEndDate(endDateComp: Ng2FlatpickrComponent) {
        let self = this;
        let d = self.startDate[0];
        console.log(endDateComp, d)
        // @ts-ignore
        endDateComp.flatpickr.config.disable = [
            function (date) {
                // return true to disable
                return (date < d);
            }
        ];
        // endDateComp.propagateChange(endDateComp.config);
        // @ts-ignore
        endDateComp.flatpickr.redraw()
        if (this.endDate === undefined || this.endDate[0] < this.startDate[0]) { // @ts-ignore
            endDateComp.setDate = this.startDate;
            // @ts-ignore
            endDateComp.flatpickr.setDate(this.startDate);
        }
    }

    logDates() {
        console.log(this.startDate?.[0] || 'None');
        console.log(this.endDate?.[0] || 'Start');
    }

    onGenerateInvoice() {
        if (this.startDate !== undefined && this.endDate !== undefined) {
            this.availableInvoices.push({
                number: "#000" + (100001 + this.availableInvoices.length),
                dated: '2021-08-31T10:48:10Z',
                startDated: this.startDate[0].toUTCString(),
                endDated: this.endDate[0].toUTCString(),
                hoursWorked: '10:45',
                amount: 10150.98,
                emails: ['someone@some.com', 'anotherperson@gmail.com', 'gotosplac@ucwe.com']
            });
        }
        this.logDates();
    }
}
