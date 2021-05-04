jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CartService } from '../service/cart.service';
import { ICart, Cart } from '../cart.model';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/service/payment.service';

import { CartUpdateComponent } from './cart-update.component';

describe('Component Tests', () => {
  describe('Cart Management Update Component', () => {
    let comp: CartUpdateComponent;
    let fixture: ComponentFixture<CartUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let cartService: CartService;
    let paymentService: PaymentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CartUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CartUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CartUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      cartService = TestBed.inject(CartService);
      paymentService = TestBed.inject(PaymentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call payment query and add missing value', () => {
        const cart: ICart = { id: 456 };
        const payment: IPayment = { id: 26102 };
        cart.payment = payment;

        const paymentCollection: IPayment[] = [{ id: 55776 }];
        spyOn(paymentService, 'query').and.returnValue(of(new HttpResponse({ body: paymentCollection })));
        const expectedCollection: IPayment[] = [payment, ...paymentCollection];
        spyOn(paymentService, 'addPaymentToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ cart });
        comp.ngOnInit();

        expect(paymentService.query).toHaveBeenCalled();
        expect(paymentService.addPaymentToCollectionIfMissing).toHaveBeenCalledWith(paymentCollection, payment);
        expect(comp.paymentsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const cart: ICart = { id: 456 };
        const payment: IPayment = { id: 89274 };
        cart.payment = payment;

        activatedRoute.data = of({ cart });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(cart));
        expect(comp.paymentsCollection).toContain(payment);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cart = { id: 123 };
        spyOn(cartService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cart });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cart }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(cartService.update).toHaveBeenCalledWith(cart);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cart = new Cart();
        spyOn(cartService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cart });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cart }));
        saveSubject.complete();

        // THEN
        expect(cartService.create).toHaveBeenCalledWith(cart);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cart = { id: 123 };
        spyOn(cartService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cart });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(cartService.update).toHaveBeenCalledWith(cart);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
