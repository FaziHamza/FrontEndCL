import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {EmployeeContractorWizardComponent} from "./employee-contrator-wizard/employee-contractor-wizard.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'initial-setup',
                component: EmployeeContractorWizardComponent
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
