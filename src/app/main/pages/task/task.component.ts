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
import { validate } from 'app/shared/models/helpers';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { TimesheetService } from 'app/shared/services/timesheet.service';
import { task } from 'app/shared/models/task';
import { TaskService } from 'app/shared/services/task.service';
import { ProjectService } from 'app/shared/services/project.service';
import { project } from 'app/shared/models/project';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent  implements OnInit {
  organizations: Organization[] = [];
  organization: Organization;
  taskObj: task;

  tempOrgId;
  isHourlyLog: boolean = false;
  isHourlyLogStatus:string = "true";

  selectedOrganization = 1;
  ngbModalRef: NgbModalRef;
  IsShowAlert;
  alertList: any[] = [];

  @Input('taskModel') taskModel: task = { taskId: 0 };

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public lookupService: LookupService,
    private authenticationService: AuthenticationService, public toastrService: ToastrService, private router: Router,
    public taskService: TaskService,
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
  taskTypes: Lookup[] = [];
  taskStatus: Lookup[] = [];


  projectList: project[] = [];

  yearStart: Lookup[] = [];

  // shiftType: Lookup;
  taskStartDate;
  taskEndDate
  ngOnInit(): void {
    debugger
    this.taskStartDate = new Date("2022-02-01T10:51:24");
    this.taskEndDate = new Date("2022-02-01T10:51:24");

    this.loadProject();

    this.loadPriorityTypes();
    this.loadTaskTypes();
    this.loadTaskStatus();


    
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
  taskForm = this.formBuilder.group({
    taskId:0,
    project:null,
    title: ['', Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)],
    description: '',
    taskNo: '',
    details: '',
    startDate: null,
    endDate: null,
    isNotificationOn: null,

    isNotifyUserByEmail: null,
    taskPlannedStartDate: null,
    taskPlannedEndDate: null,
    isPublic: null,
    version: 0,
    isActive: null,
    isDefault: false,
    priorityId: null,
    priorityType:null,
    taskType:null,
    taskStatus:null


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
  private loadTaskTypes() {
    // this.lookupService.getTypes("Org", "Shift").
    this.lookupService.getAllByParam("Task", "Type", "ALL", "0", true, true).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.taskTypes = [...value.data];
       
      }
    })
  }
  private loadTaskStatus() {
    // this.lookupService.getTypes("Org", "Shift").
    this.lookupService.getAllByParam("Task", "Status", "ALL", "0", true, true).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.taskStatus = [...value.data];
       
      }
    })
  }
  
  private loadProject() {
    // this.lookupService.getTypes("Org", "Shift").
    this.projectService.getProjectList(this.commonFunctionService.getJobId()).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.projectList = [...value.data];
       
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
    this.taskService.getTaskById(id).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        if (value.data != null) {
          

          value.data.project = this.projectList.filter(x => x.projectId == value.data.projectId)[0];
          value.data.priorityType = this.priorityTypes.filter(x => x.lookupValue == value.data.priorityId)[0];
          value.data.taskStatus = this.taskStatus.filter(x => x.lookupValue == value.data.taskStatusId)[0];
          value.data.taskType = this.taskTypes.filter(x => x.lookupValue == value.data.taskTypeId)[0];

          Object.keys(value.data).forEach(name => {
            if (this.taskForm.controls[name]) {
              this.taskForm.controls[name].patchValue(value.data[name], { onlySelf: true });
            }
            this.taskObj = value.data;
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
    if (this.taskForm.valid) {
      this.taskObj = this.taskForm.value;
      // this.organizationConfiguration.isHourlyLog = this.isHourlyLog;
      // this.taskObj.jobId = this.commonFunctionService.getJobId();
      var dataPost = { orgModel: this.taskObj };
      this.taskService.createTask(this.taskObj).subscribe(
        res => {
          if (res.successFlag) {
            // this.organizationConfiguration = res.data;
            this.IsShowAlert =true;
            this.alertList.push({name :"task  Saved!",class:"alert-success"})
            this.toastrService.success("task  Saved!");
            this.resetForm();
          } else {
            this.toastrService.error(res.message);
            this.alertList.push({name :"task  Not Saved!",class:"alert-danger"})
          }

        }, error => {
          this.toastrService.error("task  Not Saved!");
          this.alertList.push({name :"task  Configuration Not Saved!",class:"alert-warning"})

        }
      );
    }
    // else
    //   this.toastrService.warning("Please change task  !");
  }
  resetForm(){
    this.taskForm.reset();
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


