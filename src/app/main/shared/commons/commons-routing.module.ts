import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../../auth/helpers";
import {ContactsComponent} from "./contacts/contacts.component";
import {CommonsComponent} from "./commons.component";
import {GroupsComponent} from "./groups/groups.component";
import {PaymentHistoryComponent} from "./payment-history/payment-history.component";
import {PaymentService} from "../payment/payment.service";

const routes: Routes = [
    {
        path: '',
        component: CommonsComponent,
        data: {hasTopMenu: true},
        children: [
            {
                path: 'contacts',
                component: ContactsComponent,
                data: {animation: 'contacts'}
            },
            {
                path: 'contactsTest',
                component: ContactsComponent,
                data: {animation: 'contactsTest'}
            },
            {
                path: 'groups',
                component: GroupsComponent,
                data: {animation: 'groups'},
            },
            {
                path: 'payment-history',
                component: PaymentHistoryComponent,
            },
            {
                path: 'reminder',
                loadChildren: () => import('./reminder/reminder.module').then(value => value.ReminderModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommonsRoutingModule {
}
