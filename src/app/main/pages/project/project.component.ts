import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Lookup } from 'app/shared/models/lookup';
import { Organization, OrganizationConfigurationDto } from 'app/shared/models/organization';
import { AuthenticationService } from 'app/shared/services/authentication.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { environment } from 'environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { OrganizationService } from 'app/shared/services/organization.service';
import { ProjectService } from 'app/shared/services/project.service';
import { validate } from 'app/shared/models/helpers';
import { project } from 'app/shared/models/project';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { TimesheetService } from 'app/shared/services/timesheet.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  organizations: Organization[] = [];
  organization: Organization;
  projectObj: project;

  tempOrgId;
  isHourlyLog: boolean = false;
  isHourlyLogStatus:string = "true";

  selectedOrganization = 1;
  ngbModalRef: NgbModalRef;
  IsShowAlert;
  alertList: any[] = [];

  @Input('projectModel') projectModel: project = { projectId: 0 };

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public lookupService: LookupService,
    private authenticationService: AuthenticationService, public toastrService: ToastrService, private router: Router,
    public projectService: ProjectService,
    public commonFunctionService: CommonFunctionService,

  ) {
    let self = this;
    this.organization = this.authenticationService.currentOrganizationValue;
    if (this.organization === null || this.organization === undefined) {
      toastrService.info("Please Select an Organization before proceeding further!");
      router.navigate(["/"]);
    }
    this.authenticationService.organizationSubject?.subscribe(value => {
   
      
      console.log(value);
      this.organization = value;
      this.tempOrgId = value.organizationId;
    })
  }
  priorityTypes: Lookup[] = [];
  yearStart: Lookup[] = [];

  // shiftType: Lookup;
  projectStartDate;
  projectEndDate
  ngOnInit(): void {
    debugger
    this.projectStartDate = new Date("2022-02-01T10:51:24");
    this.projectEndDate = new Date("2022-02-01T10:51:24");

    this.loadPriorityTypes();
    // this.loadYearStart();

  }

  onSelectOrganization(modelContent: any) {
    this.tempOrgId = this.selectedOrganization;
    this.ngbModalRef = this.modalService.open(modelContent, { centered: true });
  }

  onChangeOrganization(id: number, input: HTMLInputElement) {
    console.log(this.tempOrgId, id);
    this.tempOrgId = id;
    if (!input.checked) {
      input.checked = true;
    }
  }

  onSubmitSearchCreateOrganization() {
    this.selectedOrganization = this.tempOrgId;
    this.ngbModalRef.close();
  }
  projectForm = this.formBuilder.group({
    projectId:0,
    name: ['', Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)],
    description: '',
    projectNo: '',

    projectStartDate: null,
    projectEndDate: null,
    isNotificationOn: null,
    isNotifyUserByEmail: null,
    projectPlannedStartDate: null,
    projectPlannedEndDate: null,
    isPublic: null,
    version: 0,
    isActive: null,
    isDefault: false,
    priorityId: null,
    priorityType:null
  })
  onClickOrganization() {

  }

  private loadPriorityTypes() {
    // this.lookupService.getTypes("Org", "Shift").
    this.lookupService.getAllByParam("Priority", "Status", "ALL", "0", true, true).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.priorityTypes = [...value.data];
       
      }
    })
  }
  private loadYearStart() {
    this.lookupService.getAllByParam("Org", "StartDay", "ALL", "0", true, true).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.yearStart = [...value.data];
       
      }
    })
  }

  public loadFormData(id) {
    debugger
    this.projectService.getProjectById(id).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        if (value.data != null) {
          

          value.data.priorityType = this.priorityTypes.filter(x => x.lookupValue == value.data.priorityId)[0];
          Object.keys(value.data).forEach(name => {
            if (this.projectForm.controls[name]) {
              this.projectForm.controls[name].patchValue(value.data[name], { onlySelf: true });
            }
            this.projectObj = value.data;
          });
        }else{
          this.toastrService.error("No Data Found", "Are you sure you put refernce Id")
        }

      }else{
        this.toastrService.error("Error", environment.errorMessage)

      }
    })
  }
  changeTimeSheetStyle() {
    if (this.isHourlyLog)
      this.isHourlyLog = false;
    else
      this.isHourlyLog = true;
  }
  orgConfigSave() {
    this.alertList =[];
    debugger
    if (this.projectForm.valid) {
      this.projectObj = this.projectForm.value;
      // this.organizationConfiguration.isHourlyLog = this.isHourlyLog;
      this.projectObj.jobId = this.commonFunctionService.getJobId();
      var dataPost = { orgModel: this.projectObj };
      this.projectService.createProject(this.projectObj).subscribe(
        res => {
          if (res.successFlag) {
            // this.organizationConfiguration = res.data;
            this.IsShowAlert =true;
            this.alertList.push({name :"Project  Saved!",class:"alert-success"})
            this.toastrService.success("Project  Saved!");
            this.resetForm();
          } else {
            this.toastrService.error(res.message);
            this.alertList.push({name :"Project  Not Saved!",class:"alert-danger"})
          }

        }, error => {
          this.toastrService.error("Project  Not Saved!");
          this.alertList.push({name :"Project  Configuration Not Saved!",class:"alert-warning"})

        }
      );
    }
    // else
    //   this.toastrService.warning("Please change Project  !");
  }
  resetForm(){
    this.projectForm.reset();
  }
  weekStartDays: Lookup[] = [
    { lookupId: 1, description: 'Monday' },
    { lookupId: 2, description: 'Thursday' },
    { lookupId: 3, description: 'Wednesday' },
    { lookupId: 4, description: 'Thursday' },
    { lookupId: 5, description: 'Friday' },
    { lookupId: 6, description: 'Saturday' },
    { lookupId: 7, description: 'Sunday' },


  ];
}


