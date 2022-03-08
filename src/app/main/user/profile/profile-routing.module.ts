import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from "./profile.component";
import {ProfileDashboardComponent} from "./profile-dashboard/profile-dashboard.component";
import {EducationComponent} from "./education/education.component";
import {WorkExperienceComponent} from "./work-experience/work-experience.component";
import {ReferenceComponent} from "./reference/reference.component";
import {SkillComponent} from "./skill/skill.component";

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        data: {hasTopMenu: true},
        children: [
            {
                path: '',
                component: ProfileDashboardComponent
            },
            {
                path: 'work-experience',
                component: WorkExperienceComponent
            },
            {
                path: 'references',
                component: ReferenceComponent
            },
            {
                path: 'education',
                component: EducationComponent
            },
            {
                path: 'skills',
                component: SkillComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule {
}
