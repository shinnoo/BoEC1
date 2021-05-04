import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrders, Orders } from '../orders.model';
import { OrdersService } from '../service/orders.service';
import { IItem } from 'app/entities/item/item.model';
import { ItemService } from 'app/entities/item/service/item.service';

@Component({
  selector: 'jhi-orders-update',
  templateUrl: './orders-update.component.html',
})
export class OrdersUpdateComponent implements OnInit {
  isSaving = false;

  itemsSharedCollection: IItem[] = [];

  editForm = this.fb.group({
    id: [],
    totalPrice: [],
    cartId: [],
    item: [],
  });

  constructor(
    protected ordersService: OrdersService,
    protected itemService: ItemService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orders }) => {
      this.updateForm(orders);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orders = this.createFromForm();
    if (orders.id !== undefined) {
      this.subscribeToSaveResponse(this.ordersService.update(orders));
    } else {
      this.subscribeToSaveResponse(this.ordersService.create(orders));
    }
  }

  trackItemById(index: number, item: IItem): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrders>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(orders: IOrders): void {
    this.editForm.patchValue({
      id: orders.id,
      totalPrice: orders.totalPrice,
      cartId: orders.cartId,
      item: orders.item,
    });

    this.itemsSharedCollection = this.itemService.addItemToCollectionIfMissing(this.itemsSharedCollection, orders.item);
  }

  protected loadRelationshipsOptions(): void {
    this.itemService
      .query()
      .pipe(map((res: HttpResponse<IItem[]>) => res.body ?? []))
      .pipe(map((items: IItem[]) => this.itemService.addItemToCollectionIfMissing(items, this.editForm.get('item')!.value)))
      .subscribe((items: IItem[]) => (this.itemsSharedCollection = items));
  }

  protected createFromForm(): IOrders {
    return {
      ...new Orders(),
      id: this.editForm.get(['id'])!.value,
      totalPrice: this.editForm.get(['totalPrice'])!.value,
      cartId: this.editForm.get(['cartId'])!.value,
      item: this.editForm.get(['item'])!.value,
    };
  }
}
