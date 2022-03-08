import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';

import {CoreTranslationService} from '@core/services/translation.service';
import { ContactContextMenuComponent } from '../../user/profile/user-info/contact-context-menu/contact-context-menu.component';

@Component({
  selector: 'app-meeting-rooms',
  templateUrl: './meeting-rooms.component.html',
  styleUrls: ['./meeting-rooms.component.scss']
})
export class MeetingRoomsComponent implements OnInit {
  public animatedContextMenu = ContactContextMenuComponent;

  contacts = [
      {
          name: "Room 1",
          description: '2021 ,CA, USA',
          type: 'Personal',
          isPublic: "Yes",
          groups: [1, 2, 3, 4]
      }
  ];
   // Private
   private _unsubscribeAll: Subject<any>;
   private tempData = [];

   // public
   public contentHeader: object;
   public rows: any;
   public selected = [];
   public kitchenSinkRows: any;
   public basicSelectedOption: number = 10;
   public ColumnMode = ColumnMode;
   public expanded = {};
   public editingName = {};
   public editingStatus = {};
   public editingAge = {};
   public editingSalary = {};
   public chkBoxSelected = [];
   public SelectionType = SelectionType;
   public exportCSVData;

   @ViewChild(DatatableComponent) table: DatatableComponent;
   @ViewChild('tableRowDetails') tableRowDetails: any;

   // snippet code variables
   isCollapsed: boolean = true;
   expenseTypes = [{name: 'General'}, {name: 'Loner'}];
   expenseType: string = '';

   constructor() {
   }

   ngOnInit() {
       // content header
       this.contentHeader = {
           headerTitle: 'Datatables',
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
                       name: 'Forms & Tables',
                       isLink: true,
                       link: '/'
                   },
                   {
                       name: 'group',
                       isLink: false
                   }
               ]
           }
       };


       for (let i = 2; i < 5; i++) {
        this.contacts.push(
            {
                name: "Room  " + i,
                description: '2021 ,CA, USA',
                type: 'Personal',
                isPublic: "No",
                groups: [1, 2, 3, 4]
            }
        );
    }


   }

}
