import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LookupsComponent} from "./lookups/lookups.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'lookups'
            },
            {
                path: 'lookups',
                component: LookupsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
