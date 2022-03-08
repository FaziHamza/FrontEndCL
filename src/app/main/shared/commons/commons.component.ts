import {Component, OnInit} from '@angular/core';
import {ContentHeader} from "../../../layout/components/content-header/content-header.component";
import {CoreMenuItem} from "../../../../@core/types";

@Component({
    selector: 'app-commons',
    templateUrl: './commons.component.html',
    styleUrls: ['./commons.component.scss']  
})
export class CommonsComponent implements OnInit {
    public contentHeader: ContentHeader = {
        headerTitle: 'Commons',
        breadcrumb: null,
        actionButton: false
    };
    menuItems: CoreMenuItem[] = [
        {id: '1', url: '/commons/contacts', title: 'Contacts', type: 'item', icon: 'user'},
        {id: '1', url: '/commons/contactsTest', title: 'Contact Test', type: 'item', icon: 'user'},
        {id: '2', url: '/commons/groups', title: 'Groups', type: 'item', icon: 'users'},
        {id: '3', url: '/commons/reminder', title: 'Reminder', type: 'item', icon: 'calendar'},
        {id: '4', url: '/commons/payment-history', title: 'Payment History', type: 'item', icon: 'layers'},
    ];

    constructor() {
    }

    ngOnInit(): void {
    }


    onNavigationChange(mi: CoreMenuItem) {
        debugger
        this.contentHeader.headerTitle = mi.title;
    }
}
