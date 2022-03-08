import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Lookup } from 'app/shared/models/lookup';
import { Organization, OrganizationConfigurationDto } from 'app/shared/models/organization';
import { AuthenticationService } from 'app/shared/services/authentication.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { environment } from 'environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { OrganizationService } from 'app/shared/services/organization.service';
import { debug } from 'console';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.scss']
})
export class TaskStatusComponent  implements OnInit {
  organizations: Organization[] = [];
  organization: Organization;
  organizationConfiguration: OrganizationConfigurationDto;

  tempOrgId;
  isHourlyLog: boolean = false;
  isHourlyLogStatus:string = "true";

  selectedOrganization = 1;
  ngbModalRef: NgbModalRef;
  IsShowAlert;
  alertList: any[] = [];
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public lookupService: LookupService,
    private authenticationService: AuthenticationService, public toastrService: ToastrService, private router: Router,
    public organizationService: OrganizationService,
  ) {
    let self = this;
    this.organization = this.authenticationService.currentOrganizationValue;
    if (this.organization === null || this.organization === undefined) {
      toastrService.info("Please Select an Organization before proceeding further!");
      router.navigate(["/"]);
    }
    this.authenticationService.organizationSubject?.subscribe(value => {
      debugger
      console.log(value);
      this.organization = value;
      this.tempOrgId = value.organizationId;
      this.loadFormData(this.organization.organizationId);
    })
  }
  shiftTypes: Lookup[] = [];
  yearStart: Lookup[] = [];

  shiftType: Lookup;

  ngOnInit(): void {
    this.loadShiftTypes();
    this.loadYearStart();

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
  orgCnfgCreateForm = this.formBuilder.group({
    organizationConfigurationId: 0,
    weekDay: null,
    startTime: null,
    endTime: null,
    shiftType: null,
    fiscalYearEnd: null,

  })
  onClickOrganization() {

  }
  private loadShiftTypes() {
    // this.lookupService.getTypes("Org", "Shift").
    this.lookupService.getAllByParam("Org", "Shift", "ALL", "0", true, true).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.shiftTypes = [...value.data];
       
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

  private loadFormData(id) {
    this.organizationService.getOrganizationConfiguration(id).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        if (value.data != null) {
          debugger

          value.data.shiftType = this.shiftTypes.filter(x => x.lookupId == value.data.shiftId)[0];
          value.data.weekDay = this.weekStartDays.filter(x => x.lookupId == value.data.weekStartDay)[0];
          this.isHourlyLog = value.data.isHourlyLog;
          Object.keys(value.data).forEach(name => {
            if (this.orgCnfgCreateForm.controls[name]) {
              this.orgCnfgCreateForm.controls[name].patchValue(value.data[name], { onlySelf: true });
            }
            this.organizationConfiguration = value.data;
          });
        }

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
    if (this.orgCnfgCreateForm.valid) {
      this.organizationConfiguration = this.orgCnfgCreateForm.value;
      this.organizationConfiguration.isHourlyLog = this.isHourlyLog;
      var dataPost = { orgModel: this.organizationConfiguration };
      this.organizationService.createOrganizationConfiguration(this.organizationConfiguration).subscribe(
        res => {
          if (res.successFlag) {
            // this.organizationConfiguration = res.data;
            this.IsShowAlert =true;
            this.alertList.push({name :"Organization Configuration Saved!",class:"alert-success"})
            this.toastrService.success("Organization Configuration Saved!");
          } else {
            this.toastrService.error(res.message);
            this.alertList.push({name :"Organization Configuration Not Saved!",class:"alert-danger"})
          }

        }, error => {
          this.toastrService.error("Organization Configuration Not Saved!");
          this.alertList.push({name :"Organization Configuration Not Saved!",class:"alert-warning"})

        }
      );
    }
    else
      this.toastrService.warning("Please any configuration !");
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
