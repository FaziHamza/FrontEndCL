import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './top-menu.component';
import {RouterModule} from "@angular/router";
import {NgbDropdownModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {CoreDirectivesModule} from "../../../../@core/directives/directives";
import {BreadcrumbModule} from "../content-header/breadcrumb/breadcrumb.module";



@NgModule({
  declarations: [
    TopMenuComponent
  ],
  exports: [
    TopMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    CoreDirectivesModule,
    BreadcrumbModule,
    NgbTooltipModule
  ]
})
export class TopMenuModule { }
