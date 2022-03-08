import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { PricingComponent } from 'app/main/shared/pricing/pricing.component';
import { PricingService } from 'app/main/shared/pricing/pricing.service';

const routes: Routes = [
  {
    path: '',
    component: PricingComponent,
    resolve: {
      kbq: PricingService
    },
    data: { animation: 'pricing' }
  }
];

@NgModule({
  declarations: [PricingComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, CoreCommonModule, ContentHeaderModule],

  providers: [PricingService]
})
export class PricingModule {}
