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
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { TimesheetService } from 'app/shared/services/timesheet.service';
import { skillCategoryDto } from 'app/shared/models/skillCategory';
import { SkillService } from 'app/shared/services/skill.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from "sweetalert2";

@Component({
  selector: 'app-skill-category',
  templateUrl: './skill-category.component.html',
  styleUrls: ['./skill-category.component.scss']
})
export class SkillCategoryComponent implements OnInit {
  organizations: Organization[] = [];
  organization: Organization;
  skillCategoryDtoObj: skillCategoryDto ={skillCategoryId:0};
  @BlockUI() blockUI: NgBlockUI;

  tempOrgId;
  isHourlyLog: boolean = false;
  isHourlyLogStatus: string = "true";

  selectedOrganization = 1;
  ngbModalRef: NgbModalRef;
  IsShowAlert;
  alertList: any[] = [];

  // @Input('projectModel') projectModel: Skill= { projectId: 0 };

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public lookupService: LookupService,
    private authenticationService: AuthenticationService, public toastrService: ToastrService, private router: Router,
    public skillService: SkillService,
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
  refIndustryType: Lookup[] = [];
  yearStart: Lookup[] = [];

  // shiftType: Lookup;
  projectStartDate;
  projectEndDate
  ngOnInit(): void {
    debugger
    this.projectStartDate = new Date("2022-02-01T10:51:24");
    this.projectEndDate = new Date("2022-02-01T10:51:24");

    this.loadIndustryTypes();
    this.loadAllSkillCategory();
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
  skillForm = this.formBuilder.group({
    skillCategoryId: 0,
    name: [' ', Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)],
    description: '',
    refIndustry: [null, Validators.required],
  })
  onClickOrganization() {

  }

  private loadIndustryTypes() {
    // this.lookupService.getTypes("Org", "Shift").
    this.lookupService.getAllByParam("Industry", "Type", "ALL", "0", true, true).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.refIndustryType = [...value.data];

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
  editSkill(value: skillCategoryDto) {
    value.refIndustry = this.refIndustryType.filter(x => x.lookupValue == value.refIndustryId)[0];
    Object.keys(value).forEach(name => {
      if (this.skillForm.controls[name]) {
        this.skillForm.controls[name].patchValue(value[name], { onlySelf: true });
      }
      this.skillCategoryDtoObj = value;
    });
  }
  deleteSkill(value: skillCategoryDto) {
    this.alertList = [];
    this.IsShowAlert = false;
    let self = this;
    
    Swal.fire({
      title: 'Delete Record',
      html: `Do you want to Delete`,
      // html: `Are you sure you want to Generate <b>${this.timeSheets.length}</b> Timesheets from StartDate: <b>'${self.timeSheetGen.startD.toLocaleDateString()}'</b> EndDate: <b>${self.timeSheetGen.endD.toLocaleDateString()}</b>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Yes',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary ml-1'
      }
    }).then(function (result) {
      if (result.value) {
        debugger
        // this.jobService.week.days[i].isWeekendDay = false;
        self.skillService.deleteSkillCategory(value.skillCategoryId).subscribe(value => {
          if (environment.logErrors)
            console.log(value);
          if (value.successFlag) {
            self.blockUI.stop();
            if (value.message.includes("FK Refernce id")) {
              self.toastrService.warning("This Skill category link with other Skills");
            } else {
              self.toastrService.success("Delete", value.message)

              self.loadAllSkillCategory();
            }
            // this.skillCategoryDtoList =[];


          } else {
            self.blockUI.stop();
            self.toastrService.error("Error", environment.errorMessage)

          }
        })
      }
    });
    this.resetForm();
  }
  getType(refIndustryId) {
    return this.refIndustryType.filter(x => x.lookupValue == refIndustryId)[0].description;

  }
  public loadFormData(id) {
    debugger
    this.skillService.getSkillCategorybyId(id).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        if (value.data != null) {


          value.data.refIndustry = this.refIndustryType.filter(x => x.lookupValue == value.data.refIndustryId)[0];
          Object.keys(value.data).forEach(name => {
            if (this.skillForm.controls[name]) {
              this.skillForm.controls[name].patchValue(value.data[name], { onlySelf: true });
            }
            this.skillCategoryDtoObj = value.data;
          });
        } else {
          this.toastrService.error("No Data Found", "Are you sure you put refernce Id")
        }

      } else {
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
    this.alertList = [];
    debugger
    if (this.skillForm.valid) {
      this.skillCategoryDtoObj = this.skillForm.value;
      this.skillCategoryDtoObj.skillCategoryId  =this.skillCategoryDtoObj.skillCategoryId==null||this.skillCategoryDtoObj.skillCategoryId==undefined?0:this.skillCategoryDtoObj.skillCategoryId;
      // this.organizationConfiguration.isHourlyLog = this.isHourlyLog;
      // this.skillCategoryDtoObj = this.commonFunctionService.getJobId();
      var dataPost = { orgModel: this.skillCategoryDtoObj };
      this.blockUI.start('Loading...');
      this.skillService.createSkillCategory(this.skillCategoryDtoObj).subscribe(
        res => {
          if (res.successFlag) {
            this.blockUI.stop();
            if (res.message.includes("FK Refernce id")) {
              this.toastrService.warning("This Skill category link with other Skills");

            } else {
              // this.organizationConfiguration = res.data;
              this.IsShowAlert = true;
              this.alertList.push({ name: "Skill Saved!", class: "alert-success" })
              this.toastrService.success("Skill Saved!");
              this.resetForm();

              this.loadAllSkillCategory();
            }
          } else {
            this.toastrService.error(res.message);
            this.blockUI.stop();

            this.alertList.push({ name: "Skill Not Saved!", class: "alert-danger" })
          }

        }, error => {
          this.toastrService.error("Skill Not Saved!");
          this.blockUI.stop();

          this.alertList.push({ name: "Skill Configuration Not Saved!", class: "alert-warning" })

        }
      );
    }
    // else
    //   this.toastrService.warning("Please change Skill !");
  }
  resetForm() {
    this.skillForm.reset();
    // this.skillForm.controls.name.value.length =0;
  }
  loadAllSkillCategory() {
    this.skillService.getSkillCategoryList().subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.skillService.skillCategoryDtoList = [];
        this.skillService.skillCategoryDtoList = [...value.data];

      } else {
        this.toastrService.error("Skill Category Data not load properly!");

      }
    })
  }
}


