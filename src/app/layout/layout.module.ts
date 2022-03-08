import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import {CustomBreakPointsProvider} from 'app/layout/custom-breakpoints';
import {VerticalLayoutModule} from 'app/layout/vertical/vertical-layout.module';
import {HorizontalLayoutModule} from 'app/layout/horizontal/horizontal-layout.module';
import {DefaultLayoutModule} from "./default-layout/default-layout.module";

@NgModule({
    imports: [FlexLayoutModule.withConfig({disableDefaultBps: true}), VerticalLayoutModule, HorizontalLayoutModule, DefaultLayoutModule],
    providers: [CustomBreakPointsProvider],
    exports: [VerticalLayoutModule, HorizontalLayoutModule, DefaultLayoutModule],
})
export class LayoutModule {
}
