import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Organization } from "../../models/organization";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Job } from "../../models/job";
import { Lookup } from 'app/shared/models/lookup';
import { JobService } from 'app/shared/services/job.service';
import { environment } from 'environments/environment.prod';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from 'app/shared/services/lookup.service';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'app/shared/services/common-funcation.service';
import moment from 'moment';

@Component({
    selector: 'app-add-edit-job',
    templateUrl: './add-edit-job.component.html',
    styleUrls: ['./add-edit-job.component.scss']
})
export class AddEditJobComponent implements OnInit {
    public contentHeader: object
    public firstName = '';
    shiftTypes: Lookup[] = [];
    @Output('onJobDataSubmit') onJobDataSubmit: EventEmitter<Job> = new EventEmitter<Job>();
    @Input('onSubmitClicked') onSubmitClicked: EventEmitter<any>;
    @Input('jobModel') jobModel: Job = { jobId: 0 };
    
    public date = new Date(); 
    public ngbDateStruct = { day: this.date.getUTCDay(), month: this.date.getUTCMonth(), year: this.date.getUTCFullYear() };

 
    jobForm = this.formBuilder.group(
        {
            jobId: '',
            organizationId: '',
            organization: '',
            title: ['', Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)],
            detail: '',
            startDate: [Validators.required],
            endDate:'',
            skills: '',
            email: '',
            phoneNo: '',
            hoursPerWeek: [Validators.required],
            isHolidayPaid: true,
            isDailyHoursRestriction: '',
            allowAutoSendApproval: '',
            allowAutoCompleteTimeSheet: '',
            hoursPerDay: [Validators.required],

            shiftType:null,
        })

        dateLessThan(from: string, to: string) {
            debugger
            return (group: FormGroup): {[key: string]: any} => {
             let f = group.controls[from];
             let t = group.controls[to];
             if (f.value > t.value) {
               return {
                 dates: "Date from should be less than Date to"
               };
             }
             return {};
            }
          }

    dateOfBirth: any;
    genders = [{ name: 'Male' }, { name: 'Female' }];
    maritalStatuses = [{ name: 'Single' }, { name: 'Married' }, { name: 'Divorced' }];
    maritalStatus: any = 'Single';
    gender: any = '';
    organizationName: any = '';
    selectBasicLoading: boolean = false;
    organizations: Organization[] =
        [
            { organizationId: 1, name: 'World Health Organization' },
            { organizationId: 2, name: 'United Nations' },
            { organizationId: 3, name: 'World Trade Organization' },
            { organizationId: 4, name: 'UNESCO' },
            { organizationId: 5, name: 'UNICEF' }];

    selectedOrganization: Organization;
    startDate: Date;
    endDate: Date;
    // @ViewChild('formJob') formJob: FormGroup;
    skills: any[] = [
        'Asp.Net', 'C#', 'JavaScript', 'Node.js'
    ];
    selectedSkill: any;
    @Input('showAllFields') showAllFields: boolean = false;
    @Input('showEditData') showEditData: string = 'noLoaded';
    @Input('organizationId') organizationId: string = 'noLoaded';

    textFieldMaxLength: number = 15;


    constructor(public commonFunctionService:CommonFunctionService, private datePipe: DatePipe,private formBuilder: FormBuilder , public jobService:JobService, public lookupService:LookupService) {
    }

    ngOnInit() {
        var ddMMyyyy = this.datePipe.transform(new Date(),"dd-MM-yyyy");
        this.loadShiftTypes();
        if (this.onSubmitClicked !== undefined) {
            this.onSubmitClicked.subscribe(value => {
                let isFormValid = this.jobForm.valid;
                if (isFormValid) {
                    this.onJobSubmit();
                }
            })
        }
    }
    private loadShiftTypes() {
        // this.lookupService.getTypes("Org", "Shift")
        this.lookupService.getAllByParam("Org", "Shift", "ALL", "0", true, true).subscribe(value => {
            if (environment.logErrors)
                console.log(value);
            if (value.successFlag) {
                this.shiftTypes = [...value.data];
                this.loadJobModalDetails();
            }
        })
    }
    setDefault(str){
        this.jobForm.controls[str].patchValue(this.jobForm.controls[str].value, { onlySelf: true });

    }
    resetDeafult(str){
        this.jobForm.controls[str].patchValue('', { onlySelf: true });

    }
    getNgbDate(date: Date): NgbDate {
        debugger
        return new NgbDate(date.getUTCFullYear(), date.getMonth() + 1, date.getDate());
    }
    myDateValue: Date;
    public loadJobModalDetails(jobModel = null, organizationConfigurationModal = null) {
        if(this.showAllFields){
            this.jobService.getJobDetailData(this.organizationId).subscribe(res => {
                if (environment.showLogs)
                    console.log(res);
                if (res.successFlag) {
                    jobModel= res.data;
                    debugger
                    jobModel.startDate = new Date(jobModel.startDate);
                    // jobModel.startDate =new Date(jobModel.startDate).toISOString().slice(0, 10);
                    debugger
                    // jobModel.startDate = this.getNgbDate(new Date(jobModel.startDate as string));
                    if(jobModel.endDate!=null){
                        jobModel.endDate = new Date(jobModel.endDate);
                    }
                    console.log(this.jobModel);
                    // this.loadShiftType(this.shiftTypes);
                    if (jobModel !== null) this.jobModel = jobModel;
                    if (this.shiftTypes != null) {
                        if (this.jobModel.shiftId != null || this.jobModel.shiftId > 0) {
                            this.jobModel.shiftType = this.shiftTypes.filter(x => x.lookupValue == this.jobModel.shiftId)[0];
                        }
                        else {
                            // organizationConfigurationModal.shiftId
                           var organizationConfiguration =this.commonFunctionService.getOrganizationConfig();
                            this.jobModel.shiftType = this.shiftTypes.filter(x => x.lookupValue == organizationConfiguration.shiftId)[0];
        
                        }
                    }
        
                    Object.keys(this.jobModel).forEach(name => {
                        if (this.jobForm.controls[name]) {
                            this.jobForm.controls[name].patchValue(this.jobModel[name], { onlySelf: true });
                        }
                    });
                   
                }
              
            });
        }else if(this.showEditData==="loaded"){
            if (true) {
                jobModel= this.jobModel;
                debugger
              
                console.log(this.jobModel);
                // this.loadShiftType(this.shiftTypes);
                if (jobModel !== null) this.jobModel = jobModel;
                // if (this.shiftTypes != null) {
                //     if (this.jobModel.shiftId != null || this.jobModel.shiftId > 0) {
                //         this.jobModel.shiftType = this.shiftTypes.filter(x => x.lookupValue == this.jobModel.shiftId)[0];
                //     }
                //     else {
                //         // organizationConfigurationModal.shiftId
                //        var organizationConfiguration =this.commonFunctionService.getOrganizationConfig();
                //         this.jobModel.shiftType = this.shiftTypes.filter(x => x.lookupValue == organizationConfiguration.shiftId)[0];
    
                //     }
                // }
    
                Object.keys(this.jobModel).forEach(name => {
                    if (this.jobForm.controls[name]) {
                        this.jobForm.controls[name].patchValue(this.jobModel[name], { onlySelf: true });
                    }
                });
               
            }
        }
       
    }

    onNameClear(account: any) {
        // this.organizationName= new OrgModal();
    }

    onJobSubmit() {
        this.onJobDataSubmit.emit(this.jobForm.value as Job);
    }
    yearStarts: Lookup[] = [
        { lookupId: 1, description: 'Jan' },
        { lookupId: 7, description: 'Jully' },
    
    
      ];
}
