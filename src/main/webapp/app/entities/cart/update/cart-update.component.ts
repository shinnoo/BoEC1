import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICart, Cart } from '../cart.model';
import { CartService } from '../service/cart.service';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/service/payment.service';

@Component({
  selector: 'jhi-cart-update',
  templateUrl: './cart-update.component.html',
})
export class CartUpdateComponent implements OnInit {
  isSaving = false;

  paymentsCollection: IPayment[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [],
    payment: [],
  });

  constructor(
    protected cartService: CartService,
    protected paymentService: PaymentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cart }) => {
      this.updateForm(cart);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cart = this.createFromForm();
    if (cart.id !== undefined) {
      this.subscribeToSaveResponse(this.cartService.update(cart));
    } else {
      this.subscribeToSaveResponse(this.cartService.create(cart));
    }
  }

  trackPaymentById(index: number, item: IPayment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICart>>): void {
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

  protected updateForm(cart: ICart): void {
    this.editForm.patchValue({
      id: cart.id,
      quantity: cart.quantity,
      payment: cart.payment,
    });

    this.paymentsCollection = this.paymentService.addPaymentToCollectionIfMissing(this.paymentsCollection, cart.payment);
  }

  protected loadRelationshipsOptions(): void {
    this.paymentService
      .query({ filter: 'cart-is-null' })
      .pipe(map((res: HttpResponse<IPayment[]>) => res.body ?? []))
      .pipe(
        map((payments: IPayment[]) => this.paymentService.addPaymentToCollectionIfMissing(payments, this.editForm.get('payment')!.value))
      )
      .subscribe((payments: IPayment[]) => (this.paymentsCollection = payments));
  }

  protected createFromForm(): ICart {
    return {
      ...new Cart(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      payment: this.editForm.get(['payment'])!.value,
    };
  }
}
