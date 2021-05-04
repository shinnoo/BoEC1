import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FullnameComponent } from './list/fullname.component';
import { FullnameDetailComponent } from './detail/fullname-detail.component';
import { FullnameUpdateComponent } from './update/fullname-update.component';
import { FullnameDeleteDialogComponent } from './delete/fullname-delete-dialog.component';
import { FullnameRoutingModule } from './route/fullname-routing.module';

@NgModule({
  imports: [SharedModule, FullnameRoutingModule],
  declarations: [FullnameComponent, FullnameDetailComponent, FullnameUpdateComponent, FullnameDeleteDialogComponent],
  entryComponents: [FullnameDeleteDialogComponent],
})
export class FullnameModule {}
