import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  public contentHeader: object
  public firstName = '';

  languages = [{name: 'EN'}, {name: 'IT'}];
  language = '';
  dateOfBirth: any;
  genders = [{name: 'Male'}, {name: 'Female'}];
  jobExperience = [{name: 'Tharsol' ,title :'ABC' , skill :'C#, ASP'}, {name: 'TechSol' ,title :'Xyz' , skill :'JAva, JSP'}];
  reference = [{name: 'Abid' ,email :'info@gmail.com' , type :'ASP'}, {name: 'Ahmad' ,email :'ghy@ingo.com' , type :'JSP'}];
  education = [{name: 'Abid' ,email :'info@gmail.com' , type :'ASP'}, {name: 'Ahmad' ,email :'ghy@ingo.com' , type :'JSP'},{name: 'Abid' ,email :'info@gmail.com' , type :'PHP'}];

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
                      name: 'org',
                      isLink: false
                  }
              ]
          }
      }
  }

}
