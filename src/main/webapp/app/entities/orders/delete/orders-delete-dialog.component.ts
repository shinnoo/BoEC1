import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrders } from '../orders.model';
import { OrdersService } from '../service/orders.service';

@Component({
  templateUrl: './orders-delete-dialog.component.html',
})
export class OrdersDeleteDialogComponent {
  orders?: IOrders;

  constructor(protected ordersService: OrdersService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ordersService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
