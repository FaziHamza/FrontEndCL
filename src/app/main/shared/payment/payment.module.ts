import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PaymentRoutingModule} from './payment-routing.module';
import {MakePaymentComponent} from './make-payment/make-payment.component';
import {PaymentHistoryComponent} from '../commons/payment-history/payment-history.component';
import {PaymentComponent} from './payment.component';
import {ContentHeaderModule} from "../../../layout/components/content-header/content-header.module";
import {PaymentItemComponent} from './payment-item/payment-item.component';
import {CoreCommonModule} from "../../../../@core/common.module";
import {FormsModule} from "@angular/forms";
import {CoreTouchspinModule} from "../../../../@core/components/core-touchspin/core-touchspin.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SWIPER_CONFIG, SwiperConfigInterface} from "ngx-swiper-wrapper";
import {SwiperModule} from "swiper/angular";
import {CoreSidebarModule} from "../../../../@core/components";
import {NouisliderModule} from "ng2-nouislider";


const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    observer: true
};

@NgModule({
    declarations: [
        MakePaymentComponent,
        PaymentComponent,
        PaymentItemComponent
    ],
    imports: [
        CommonModule,
        PaymentRoutingModule,
        ContentHeaderModule,
        CoreCommonModule,
        FormsModule,
        CoreTouchspinModule,
        NgbModule,
        SwiperModule,
        CoreSidebarModule,
        NouisliderModule
    ],
    providers: [
        {
            provide: SWIPER_CONFIG,
            useValue: DEFAULT_SWIPER_CONFIG
        }
    ]
})
export class PaymentModule {
}
