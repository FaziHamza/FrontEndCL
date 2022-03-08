import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  constructor() { }
  public contentHeader: object;
  invoice = [
    {
        name: "Room 1",
        description: '2021 ,CA, USA',
        type: 'Personal',
        isPublic: "Yes",
        groups: [1, 2, 3, 4]
    }
];
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
                    name: 'invoice',
                    isLink: false
                }
            ]
        }
    }
    for (let i = 2; i < 4; i++) {
      this.invoice.push(
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
