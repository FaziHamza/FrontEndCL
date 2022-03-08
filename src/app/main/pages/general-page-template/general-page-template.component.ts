import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-general-page-template',
    templateUrl: './general-page-template.component.html',
    styleUrls: ['./general-page-template.component.scss']
})
export class GeneralPageTemplateComponent implements OnInit {
    public radioModel = 1;
    public checkboxModel = {
        left: true,
        middle: false,
        right: false
    };

    constructor() {
    }

    ngOnInit(): void {
    }

}
