import {Component, OnInit} from '@angular/core'

import {locale as en} from './i18n/en'
import {locale as fr} from './i18n/fr'
import {locale as de} from './i18n/de'
import {locale as pt} from './i18n/pt'

import {CoreTranslationService} from '@core/services/translation.service'

@Component({
    selector: 'app-sample',
    templateUrl: './sample.component.html',
    styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {
    public contentHeader: object

    /**
     *
     * @param {CoreTranslationService} _coreTranslationService
     */
    constructor(private _coreTranslationService: CoreTranslationService) {
        this._coreTranslationService.translate(en, fr, de, pt)
    }

    checkinTypes = [
        {id: 1, name: 'Time In'},
        {id: 2, name: 'Time Out'},
        {id: 3, name: 'Break In'},
        {id: 4, name: 'Break Out'},
    ];

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit() {
        this.contentHeader = {
            headerTitle: 'Home',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'Home',
                        isLink: true,
                        link: '/'
                    },
                    {
                        name: 'Sample',
                        isLink: false
                    }
                ]
            }
        }
    }

    public items = [
        {
            id: '',
            type: '',
            time: '',
            comment: '',
        }];

    public item = {
        itemName: '',
        itemQuantity: '',
        itemCost: ''
    };

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add Item
     */
    addItem() {
        this.items.push({
            id: '',
            type: '',
            time: '',
            comment: ''
        });
    }

    /**
     * DeleteItem
     *
     * @param id
     */
    deleteItem(id) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items.indexOf(this.items[i]) === id) {
                this.items.splice(i, 1);
                break;
            }
        }
    }

    emittedEvents($event: any) {
        console.log('Action : ', $event);
    }
}
