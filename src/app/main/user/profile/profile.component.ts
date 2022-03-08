import {Component, OnInit} from '@angular/core';
import {ContentHeader} from "../../../layout/components/content-header/content-header.component";
import {CoreMenuItem} from "../../../../@core/types";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    public contentHeader: ContentHeader = {
        headerTitle: 'Profile Dashboard',
        breadcrumb: null,
        actionButton: false
    };
    menuItems: CoreMenuItem[] = [
        {id: '1', url: '/profile', title: 'Dashboard', type: 'item', icon: 'home'},
        {id: '2', url: '/profile/education', title: 'Educations', type: 'item', icon: 'book'},
        {
            id: '3',
            url: '/profile/work-experience',
            title: 'Experiences',
            tooltip: 'Work Experiences',
            type: 'item',
            icon: 'briefcase'
        },
        {id: '4', url: '/profile/references', title: 'References', type: 'item', icon: 'user-check'},
        {id: '5', url: '/profile/skills', title: 'Skills', type: 'item', icon: 'award'},
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

    onNavigationChange(mi: CoreMenuItem) {
        this.contentHeader.headerTitle = mi.title;
    }
}
