import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFullname } from '../fullname.model';
import { FullnameService } from '../service/fullname.service';

@Component({
  templateUrl: './fullname-delete-dialog.component.html',
})
export class FullnameDeleteDialogComponent {
  fullname?: IFullname;

  constructor(protected fullnameService: FullnameService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fullnameService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
