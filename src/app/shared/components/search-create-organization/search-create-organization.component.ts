import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Organization } from "../../models/organization";
import { map, tap } from 'rxjs/operators';
import { tokenName } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from "@angular/forms";
import { OrganizationService } from 'app/shared/services/organization.service';
import { Observable, of } from 'rxjs';
import { debug } from 'console';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-search-create-organization',
    templateUrl: './search-create-organization.component.html',
    styleUrls: ['./search-create-organization.component.scss'],
})
export class SearchCreateOrganizationComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    organizations: Observable<Organization[]> = new Observable<Organization[]>();
    //  =
    //         [{id: 1, name: 'World Health Organization'},
    //         {id: 2, name: 'United Nations'},
    //         {id: 3, name: 'World Trade Organization'},
    //         {id: 4, name: 'UNESCO'},
    //         {id: 5, name: 'UNICEF'}];

    @Input('onSubmitClicked') onSubmitClicked: EventEmitter<any>;
    @Output('onSubmitClicked') submitClicked: EventEmitter<any> = new EventEmitter<any>();

    @Input('organization') organization: Organization = { organizationId: 0 };

    orgId: number = 0;

    orgSearchCreateForm = this.formBuilder.group({
        organization: [this.organization?.name],
        email: [this.organization?.email],
        website: [this.organization?.website],

    })
    selectBasicLoading: boolean = false;

    constructor(private formBuilder: FormBuilder,
        private orgService: OrganizationService,
        private _toastrService: ToastrService) {
    }

    ngOnInit(): void {
        debugger
        if (this.organization?.name !== undefined && this.organization?.name !== null) {
            this.orgSearchCreateForm.controls['organization'].patchValue(this.organization.name, { onlySelf: true });
            this.orgSearchCreateForm.controls['email'].patchValue(this.organization.email, { onlySelf: true });
            this.orgSearchCreateForm.controls['website'].patchValue(this.organization.website, { onlySelf: true });

        }

        if (this.onSubmitClicked !== undefined) {
            debugger
            this.onSubmitClicked.subscribe(value => {
                let isFormValid = this.orgSearchCreateForm.valid;
                if (isFormValid) {
                    if (this.organization) {
                        this.submitClicked.emit({ id: this.organization.organizationId, name: this.orgSearchCreateForm.value['organization'] ,email: this.orgSearchCreateForm.value['email'],website: this.orgSearchCreateForm.value['website'] ,isFormValid:isFormValid });
                    } else {
                        this.submitClicked.emit({ id: 0, name: this.orgSearchCreateForm.value['organization'],email: this.orgSearchCreateForm.value['email'],website: this.orgSearchCreateForm.value['website'] ,isFormValid:isFormValid });
                    }


                }
            })
        }
        //this.getAllOrganizations();

    }


    getAllOrganizations(search?: string) {
        this.orgService.getAllOrganizations(search)
            .subscribe(
                res => {
                    if (search && res.data.length <= 0) {

                        this.organizations = of([{ id: 0, name: search }]);

                    } else {
                        this.organizations = of(res.data);
                    }

                }
            );
    }

    // createNewOrganization = (name) => {
    //     debugger
    //     let self = this;
    //     let model = { id: 0, name: "" };
    //     this.orgService.createOrganization({ name: name }).subscribe(
    //         res => {
    //             model.id = res.data.id;
    //             model.name = res.data.name;
    //         },
    //         error => {
    //             console.log(error);
    //         }
    //     );
    //     console.log(this, self, name);
    //     return model;
    // }

    onSearch(event) {
        this.getAllOrganizations(event.term)
    }

}
