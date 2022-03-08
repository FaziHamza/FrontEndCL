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
import { skillDto } from 'app/shared/models/skill';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from "sweetalert2";

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements OnInit {
  organizations: Organization[] = [];
  organization: Organization;
  skillDtoObj: skillDto ;
  // skillCategoryDtoList: skillCategoryDto[] ;

  skillCategoryTpe: skillCategoryDto[] = [];
  yearStart: Lookup[] = [];

  tempOrgId;
  isHourlyLog: boolean = false;
  isHourlyLogStatus:string = "true";

  selectedOrganization = 1;
  ngbModalRef: NgbModalRef;
  IsShowAlert;
  alertList: any[] = [];

  // @Input('projectModel') projectModel: Skill= { projectId: 0 };
  @BlockUI() blockUI: NgBlockUI;
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

  ngOnInit(): void {
    debugger
    this.skillService.skillDtoList =[];
    this.skillService.skillDtoList.length =0;

    this.loadAllSkillCategory();
    this.skillService.skillDtoList =[]
    this.loadAllSkill();
    // this.loadYearStart();

  }
  loadAllSkillCategory(){
    this.skillService.getSkillCategoryList().subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.skillCategoryTpe =[];
        this.skillCategoryTpe = [...value.data];
       
      }
    })
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
    skillId:0,
    skillCategoryId:0,
    name: ['', Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)],
    description: '',
    skillCategory: [null,Validators.required],
  })
  onClickOrganization() {

  }

 

  editSkill( value:skillDto){
    debugger
    value.skillCategory = this.skillCategoryTpe.filter(x => x.skillCategoryId == value.skillCategoryId)[0]
    Object.keys(value).forEach(name => {
      if (this.skillForm.controls[name]) {
        this.skillForm.controls[name].patchValue(value[name], { onlySelf: true });
      }
      this.skillDtoObj = value;
    });
  }
  deleteSkill( value:skillDto){
    this.IsShowAlert = false;
    this.alertList =[];

    let self = this;
    Swal.fire({
      title: 'Delete Record',
      html: `Do you want to Delete`,
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
        self.skillService.deleteSkill(value.skillId).subscribe(value => {
          if (environment.logErrors)
            console.log(value);
          if (value.successFlag) {
            // this.skillCategoryDtoList =[];
            self.toastrService.success("Delete", value.message)
            self.skillService.skillDtoList =[];
            self.loadAllSkill();
    
          }else{
            self.toastrService.error("Error", environment.errorMessage)
    
          }
        })
      }
    });

   
  }
  getType(id) {
    return  this.skillCategoryTpe.filter(x => x.skillCategoryId == id)[0].name;
  }
  public loadFormData(id) {
    debugger
    this.skillService.getSkillbyId(id).subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        if (value.data != null) {
          

          // value.data.refIndustry = this.refIndustryType.filter(x => x.lookupValue == value.data.refIndustryId)[0];
          Object.keys(value.data).forEach(name => {
            if (this.skillForm.controls[name]) {
              this.skillForm.controls[name].patchValue(value.data[name], { onlySelf: true });
            }
            this.skillDtoObj = value.data;
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
    if (this.skillForm.valid) {
      this.skillDtoObj = this.skillForm.value;
      this.skillDtoObj.skillId  =this.skillDtoObj.skillId==null||this.skillDtoObj.skillId==undefined?0:this.skillDtoObj.skillId;

      // this.organizationConfiguration.isHourlyLog = this.isHourlyLog;
      // this.skillCategoryDtoObj = this.commonFunctionService.getJobId();
      var dataPost = { orgModel: this.skillDtoObj };
      this.blockUI.start('Loading...');

      this.skillService.createSkill(this.skillDtoObj).subscribe(
        res => {
          if (res.successFlag) {
            this.blockUI.stop();
            // this.organizationConfiguration = res.data;
            this.IsShowAlert =true;
            this.alertList.push({name :"Skill Saved!",class:"alert-success"})
            this.toastrService.success("Skill Saved!");
            this.resetForm();
      
            this.loadAllSkill();
          } else {
            this.toastrService.error(res.message);
            this.blockUI.stop();
            this.alertList.push({name :"Skill Not Saved!",class:"alert-danger"})
          }

        }, error => {
          this.toastrService.error("Skill Not Saved!");
          this.blockUI.stop();
          this.alertList.push({name :"Skill Configuration Not Saved!",class:"alert-warning"})

        }
      );
    }
    // else
    //   this.toastrService.warning("Please change Skill !");
  }
  resetForm(){
    this.skillForm.reset();
  }
  loadAllSkill(){
    this.skillService.getSkillList().subscribe(value => {
      if (environment.logErrors)
        console.log(value);
      if (value.successFlag) {
        this.skillService.skillDtoList =[];
        this.skillService.skillDtoList = [...value.data];
       
      }
    })
  }
}


