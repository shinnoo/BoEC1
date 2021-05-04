jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CustomerService } from '../service/customer.service';
import { ICustomer, Customer } from '../customer.model';
import { IFullname } from 'app/entities/fullname/fullname.model';
import { FullnameService } from 'app/entities/fullname/service/fullname.service';
import { IOrders } from 'app/entities/orders/orders.model';
import { OrdersService } from 'app/entities/orders/service/orders.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/service/payment.service';

import { CustomerUpdateComponent } from './customer-update.component';

describe('Component Tests', () => {
  describe('Customer Management Update Component', () => {
    let comp: CustomerUpdateComponent;
    let fixture: ComponentFixture<CustomerUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let customerService: CustomerService;
    let fullnameService: FullnameService;
    let ordersService: OrdersService;
    let addressService: AddressService;
    let paymentService: PaymentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CustomerUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CustomerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CustomerUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      customerService = TestBed.inject(CustomerService);
      fullnameService = TestBed.inject(FullnameService);
      ordersService = TestBed.inject(OrdersService);
      addressService = TestBed.inject(AddressService);
      paymentService = TestBed.inject(PaymentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call fullname query and add missing value', () => {
        const customer: ICustomer = { id: 456 };
        const fullname: IFullname = { id: 79984 };
        customer.fullname = fullname;

        const fullnameCollection: IFullname[] = [{ id: 32977 }];
        spyOn(fullnameService, 'query').and.returnValue(of(new HttpResponse({ body: fullnameCollection })));
        const expectedCollection: IFullname[] = [fullname, ...fullnameCollection];
        spyOn(fullnameService, 'addFullnameToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        expect(fullnameService.query).toHaveBeenCalled();
        expect(fullnameService.addFullnameToCollectionIfMissing).toHaveBeenCalledWith(fullnameCollection, fullname);
        expect(comp.fullnamesCollection).toEqual(expectedCollection);
      });

      it('Should call Orders query and add missing value', () => {
        const customer: ICustomer = { id: 456 };
        const orders: IOrders = { id: 95333 };
        customer.orders = orders;

        const ordersCollection: IOrders[] = [{ id: 60534 }];
        spyOn(ordersService, 'query').and.returnValue(of(new HttpResponse({ body: ordersCollection })));
        const additionalOrders = [orders];
        const expectedCollection: IOrders[] = [...additionalOrders, ...ordersCollection];
        spyOn(ordersService, 'addOrdersToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        expect(ordersService.query).toHaveBeenCalled();
        expect(ordersService.addOrdersToCollectionIfMissing).toHaveBeenCalledWith(ordersCollection, ...additionalOrders);
        expect(comp.ordersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Address query and add missing value', () => {
        const customer: ICustomer = { id: 456 };
        const address: IAddress = { id: 59756 };
        customer.address = address;

        const addressCollection: IAddress[] = [{ id: 97992 }];
        spyOn(addressService, 'query').and.returnValue(of(new HttpResponse({ body: addressCollection })));
        const additionalAddresses = [address];
        const expectedCollection: IAddress[] = [...additionalAddresses, ...addressCollection];
        spyOn(addressService, 'addAddressToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        expect(addressService.query).toHaveBeenCalled();
        expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, ...additionalAddresses);
        expect(comp.addressesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Payment query and add missing value', () => {
        const customer: ICustomer = { id: 456 };
        const payment: IPayment = { id: 65074 };
        customer.payment = payment;

        const paymentCollection: IPayment[] = [{ id: 84787 }];
        spyOn(paymentService, 'query').and.returnValue(of(new HttpResponse({ body: paymentCollection })));
        const additionalPayments = [payment];
        const expectedCollection: IPayment[] = [...additionalPayments, ...paymentCollection];
        spyOn(paymentService, 'addPaymentToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        expect(paymentService.query).toHaveBeenCalled();
        expect(paymentService.addPaymentToCollectionIfMissing).toHaveBeenCalledWith(paymentCollection, ...additionalPayments);
        expect(comp.paymentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const customer: ICustomer = { id: 456 };
        const fullname: IFullname = { id: 10168 };
        customer.fullname = fullname;
        const orders: IOrders = { id: 28976 };
        customer.orders = orders;
        const address: IAddress = { id: 61692 };
        customer.address = address;
        const payment: IPayment = { id: 26655 };
        customer.payment = payment;

        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(customer));
        expect(comp.fullnamesCollection).toContain(fullname);
        expect(comp.ordersSharedCollection).toContain(orders);
        expect(comp.addressesSharedCollection).toContain(address);
        expect(comp.paymentsSharedCollection).toContain(payment);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const customer = { id: 123 };
        spyOn(customerService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: customer }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(customerService.update).toHaveBeenCalledWith(customer);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const customer = new Customer();
        spyOn(customerService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: customer }));
        saveSubject.complete();

        // THEN
        expect(customerService.create).toHaveBeenCalledWith(customer);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const customer = { id: 123 };
        spyOn(customerService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(customerService.update).toHaveBeenCalledWith(customer);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackFullnameById', () => {
        it('Should return tracked Fullname primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackFullnameById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackOrdersById', () => {
        it('Should return tracked Orders primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackOrdersById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackAddressById', () => {
        it('Should return tracked Address primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAddressById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPaymentById', () => {
        it('Should return tracked Payment primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPaymentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
