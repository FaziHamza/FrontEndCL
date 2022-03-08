import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JobSalary } from 'app/shared/models/job';
import { Lookup } from 'app/shared/models/lookup';
import { JobSalaryDto } from 'app/shared/models/timeSheetDetail';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import { JobService } from 'app/shared/services/job.service';
import { LookupService } from 'app/shared/services/lookup.service';
import { lookup } from 'dns';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-add-edit-salary',
  templateUrl: './add-edit-salary.component.html',
  styleUrls: ['./add-edit-salary.component.scss']
})
export class AddEditSalaryComponent implements OnInit {
  public contentHeader: object
  @Output('onJobDataSubmit') onJobDataSubmit: EventEmitter<JobSalary> = new EventEmitter<JobSalary>();
  @Input('onSubmitClicked') onSubmitClicked: EventEmitter<any>;
  @Input('onDeleteClicked') onDeleteClicked: EventEmitter<any>;

  @Input('showAllFields') showAllFields: boolean = false;
  @Input('jobSalaryModal') jobModel: JobSalary = { jobSalaryId: 0 };
  textFieldMaxLength: number = 15;
  selectBasicLoading: boolean = false;
  jobSalaryForm = this.formBuilderSalary.group({
    jobSalaryId: 0,
    salary: ['', Validators.required],
    salaryType: [null, Validators.required],
    title: ['', Validators.required],
    isActive: true,
    jobId: 0,
  })

  salaryTypes: Lookup[] = [
    { lookupId: 1, description: 'Hourly' },
    { lookupId: 2, description: 'Monthly' }
  ];
  shiftTypes: Lookup[] = [];
  constructor( public commonFunctionService: CommonFunctionService, public lookupService:LookupService,private formBuilderSalary: FormBuilder, public jobService: JobService) {
  }
  private loadShiftTypes() {
    // this.lookupService.getTypes("Org", "Shift").
    this.lookupService.getAllByParam("Org", "Shift", "ALL", "0", true, true).subscribe(value => {
        if (environment.logErrors)
            console.log(value);
        if (value.successFlag) {
            this.shiftTypes = [...value.data];
            this.loadJobModalDetails();
        }
    })
}

  public loadJobModalDetails(jobModel = null) {
    
    this.jobService.getJobSalary(this.commonFunctionService.getJobId()).subscribe(res => {
      if (environment.showLogs)
          console.log(res);
      if (res.successFlag){
        debugger
        jobModel= res.data;
        console.log(this.jobModel);
        if (jobModel !== null) this.jobModel = jobModel;
        // Object.keys(this.jobModel).forEach(name => {
        //     if (this.jobSalaryForm.controls[name]) {
        //         this.jobSalaryForm.controls[name].patchValue(this.jobModel[name], {onlySelf: true});
        //     }
        // });
        this.jobService.jobSalaryList = jobModel;
        if (jobModel != null)
          if (this.jobService.jobSalaryList.length > 0)
            this.jobService.jobSalaryList.forEach(ele => {
              ele.salaryType = this.salaryTypes.filter(x => x.lookupId == ele.salaryTypeId)[0]
            })
        console.log(this.jobService.jobSalaryList);
        if (this.jobService.jobSalaryList != null) {
          this.jobService.IsShowTable = (this.jobService.jobSalaryList.length == 0) ? false : true
        } else {
          this.jobService.IsShowTable = false;
        };
        // this.jobService.jobSalaryList.sort((a, b) => (a.id < b.id) ? 1 : -1)
        this.jobService.jobSalaryList?.sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1))
      }
    }, error => {
      if (environment.logErrors) {
          console.log(error);
      }
  });
   
  }
   sortDir = 1;//1= 'ASE' -1= DSC
  sortArr(colName:any){
    this.jobService.jobSalaryList.sort((a,b)=>{
      a= a[colName].toLowerCase();
      b= b[colName].toLowerCase();
      
      return 1;
    });
  }
  
  showSalary() {
    if (this.jobService.IsShowSalary)
    {
      this.jobService.IsShowSalary = false;
    }
    else{
      this.jobSalaryForm.controls['title'].patchValue('', { onlySelf: true });
      this.jobSalaryForm.controls['salary'].patchValue(0, { onlySelf: true });
      
      this.jobService.IsShowSalary = true;
    }

  }
  editSalary(JobSalary: JobSalary, type: string) {
    debugger
    if (type == "edit") {
      this.jobService.IsShowSalary = true;
      Object.keys(JobSalary).forEach(name => {
        if (this.jobSalaryForm.controls[name]) {
          this.jobSalaryForm.controls[name].patchValue(JobSalary[name], { onlySelf: true });
        }
      });
    } else {
      this.jobService.salaryDeleteIds.push(JobSalary.jobSalaryId);
      this.jobService.jobSalaryList = this.jobService.jobSalaryList.filter(x => x.jobSalaryId != JobSalary.jobSalaryId);
      this.jobService.IsShowTable = (this.jobService.jobSalaryList.length == 0) ? false : true
    }
  }
  ngOnInit() {
    this.showSalary();
    this.loadJobModalDetails();
    if (this.onSubmitClicked !== undefined) {
      this.onSubmitClicked.subscribe(value => {
        let isFormValid = this.jobSalaryForm.valid;
        if (isFormValid) {
          this.onJobSalarySubmit();
        }
      })
    }
  }
  setDefault(str){
    this.jobSalaryForm.controls[str].patchValue(this.jobSalaryForm.controls[str].value, { onlySelf: true });

}
resetDeafult(str){
    this.jobSalaryForm.controls[str].patchValue('', { onlySelf: true });

}
  onJobSalarySubmit() {
    this.onJobDataSubmit.emit(this.jobSalaryForm.value as JobSalary);
  }
}
