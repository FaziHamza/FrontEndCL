import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PaymentComponent} from "./payment.component";
import {PaymentService} from "./payment.service";
import {PaymentHistoryComponent} from "../commons/payment-history/payment-history.component";

const routes: Routes = [
    {
        path: '',
        component: PaymentComponent,
        resolve: {
            ecommerce: PaymentService
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentRoutingModule {
}
