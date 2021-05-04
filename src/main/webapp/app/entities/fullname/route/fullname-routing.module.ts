import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FullnameComponent } from '../list/fullname.component';
import { FullnameDetailComponent } from '../detail/fullname-detail.component';
import { FullnameUpdateComponent } from '../update/fullname-update.component';
import { FullnameRoutingResolveService } from './fullname-routing-resolve.service';

const fullnameRoute: Routes = [
  {
    path: '',
    component: FullnameComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FullnameDetailComponent,
    resolve: {
      fullname: FullnameRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FullnameUpdateComponent,
    resolve: {
      fullname: FullnameRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FullnameUpdateComponent,
    resolve: {
      fullname: FullnameRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fullnameRoute)],
  exports: [RouterModule],
})
export class FullnameRoutingModule {}
