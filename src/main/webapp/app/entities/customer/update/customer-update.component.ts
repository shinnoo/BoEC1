import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICustomer, Customer } from '../customer.model';
import { CustomerService } from '../service/customer.service';
import { IFullname } from 'app/entities/fullname/fullname.model';
import { FullnameService } from 'app/entities/fullname/service/fullname.service';
import { IOrders } from 'app/entities/orders/orders.model';
import { OrdersService } from 'app/entities/orders/service/orders.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/service/payment.service';

@Component({
  selector: 'jhi-customer-update',
  templateUrl: './customer-update.component.html',
})
export class CustomerUpdateComponent implements OnInit {
  isSaving = false;

  fullnamesCollection: IFullname[] = [];
  ordersSharedCollection: IOrders[] = [];
  addressesSharedCollection: IAddress[] = [];
  paymentsSharedCollection: IPayment[] = [];

  editForm = this.fb.group({
    id: [],
    age: [],
    fullname: [],
    orders: [],
    address: [],
    payment: [],
  });

  constructor(
    protected customerService: CustomerService,
    protected fullnameService: FullnameService,
    protected ordersService: OrdersService,
    protected addressService: AddressService,
    protected paymentService: PaymentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      this.updateForm(customer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.createFromForm();
    if (customer.id !== undefined) {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    }
  }

  trackFullnameById(index: number, item: IFullname): number {
    return item.id!;
  }

  trackOrdersById(index: number, item: IOrders): number {
    return item.id!;
  }

  trackAddressById(index: number, item: IAddress): number {
    return item.id!;
  }

  trackPaymentById(index: number, item: IPayment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomer>>): void {
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

  protected updateForm(customer: ICustomer): void {
    this.editForm.patchValue({
      id: customer.id,
      age: customer.age,
      fullname: customer.fullname,
      orders: customer.orders,
      address: customer.address,
      payment: customer.payment,
    });

    this.fullnamesCollection = this.fullnameService.addFullnameToCollectionIfMissing(this.fullnamesCollection, customer.fullname);
    this.ordersSharedCollection = this.ordersService.addOrdersToCollectionIfMissing(this.ordersSharedCollection, customer.orders);
    this.addressesSharedCollection = this.addressService.addAddressToCollectionIfMissing(this.addressesSharedCollection, customer.address);
    this.paymentsSharedCollection = this.paymentService.addPaymentToCollectionIfMissing(this.paymentsSharedCollection, customer.payment);
  }

  protected loadRelationshipsOptions(): void {
    this.fullnameService
      .query({ filter: 'customer-is-null' })
      .pipe(map((res: HttpResponse<IFullname[]>) => res.body ?? []))
      .pipe(
        map((fullnames: IFullname[]) =>
          this.fullnameService.addFullnameToCollectionIfMissing(fullnames, this.editForm.get('fullname')!.value)
        )
      )
      .subscribe((fullnames: IFullname[]) => (this.fullnamesCollection = fullnames));

    this.ordersService
      .query()
      .pipe(map((res: HttpResponse<IOrders[]>) => res.body ?? []))
      .pipe(map((orders: IOrders[]) => this.ordersService.addOrdersToCollectionIfMissing(orders, this.editForm.get('orders')!.value)))
      .subscribe((orders: IOrders[]) => (this.ordersSharedCollection = orders));

    this.addressService
      .query()
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing(addresses, this.editForm.get('address')!.value))
      )
      .subscribe((addresses: IAddress[]) => (this.addressesSharedCollection = addresses));

    this.paymentService
      .query()
      .pipe(map((res: HttpResponse<IPayment[]>) => res.body ?? []))
      .pipe(
        map((payments: IPayment[]) => this.paymentService.addPaymentToCollectionIfMissing(payments, this.editForm.get('payment')!.value))
      )
      .subscribe((payments: IPayment[]) => (this.paymentsSharedCollection = payments));
  }

  protected createFromForm(): ICustomer {
    return {
      ...new Customer(),
      id: this.editForm.get(['id'])!.value,
      age: this.editForm.get(['age'])!.value,
      fullname: this.editForm.get(['fullname'])!.value,
      orders: this.editForm.get(['orders'])!.value,
      address: this.editForm.get(['address'])!.value,
      payment: this.editForm.get(['payment'])!.value,
    };
  }
}
