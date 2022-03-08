import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
    public contentHeader: object
    public firstName = '';

    languages = [{name: 'EN'}, {name: 'IT'}];
    language = '';
    dateOfBirth: any;
    genders = [{name: 'Male'}, {name: 'Female'}];
    maritalStatuses = [{name: 'Single'}, {name: 'Married'}, {name: 'Divorced'}];
    maritalStatus: any = 'Single';
    gender: any = '';

    constructor() {
    }

    ngOnInit() {
        this.contentHeader = {
            headerTitle: 'USER',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'USER',
                        isLink: true,
                        link: '/'
                    },
                    {
                        name: 'UserInfo',
                        isLink: false
                    }
                ]
            }
        }
    }

}
