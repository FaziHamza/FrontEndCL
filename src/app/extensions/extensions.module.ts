import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomToastrComponent} from "./custom-toastr/custom-toastr.component";


@NgModule({
    declarations: [
        CustomToastrComponent
    ],
    imports: [
        CommonModule
    ],

    entryComponents: [CustomToastrComponent]
})
export class ExtensionsModule {
}
