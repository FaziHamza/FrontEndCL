import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ContentHeader} from "../content-header/content-header.component";
import {CoreConfigService} from "../../../../@core/services/config.service";
import {CoreMenuItem} from "../../../../@core/types";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AuthenticationService} from "../../../shared/services/authentication.service";
import {OrganizationService} from "../../../shared/services/organization.service";
import {Organization} from "../../../shared/models/organization";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: '[app-top-menu]',
    templateUrl: './top-menu.component.html',
    styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
    @Input() contentHeader: ContentHeader;
    @Input() menuItems: CoreMenuItem[];
    @Input() showBackButton: boolean = true;
    @Input() backButtonRoute: string = '';
    @Input() showOrganizationSelector = false;
    @Output() onItemClick: EventEmitter<CoreMenuItem> = new EventEmitter<CoreMenuItem>();

    selectedOrganization = 1;
    tempOrgId;
    ngbModalRef: NgbModalRef;
    organizations: Organization[] = [];
    organization: Organization;

    constructor(private _coreConfigService: CoreConfigService,
                private modalService: NgbModal,
                organizationService: OrganizationService,
                private router: Router,
                toastrService: ToastrService,
                private authenticationService: AuthenticationService) {
        let self = this;
        
        this.organization = this.authenticationService.currentOrganizationValue;
        if (this.organization === null || this.organization === undefined) {
        
            toastrService.info("Please Select an Organization before proceeding further!");
            router.navigate(["/"]);
        }

        this.authenticationService.organizationSubject?.subscribe(value => {
            
            console.log(value);
            this.organization = value;
        
        })
    }

    ngOnInit(): void {
        this._coreConfigService.hasTopMenu = true;
    }

    onSelectOrganization(modelContent: any) {
        this.tempOrgId = this.selectedOrganization;
        this.ngbModalRef = this.modalService.open(modelContent, {centered: true});
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

    onClickOrganization() {
        this.router.navigate(["/pages/org"]);
    }
}
