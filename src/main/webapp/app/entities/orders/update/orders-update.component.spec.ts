jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrdersService } from '../service/orders.service';
import { IOrders, Orders } from '../orders.model';
import { IItem } from 'app/entities/item/item.model';
import { ItemService } from 'app/entities/item/service/item.service';

import { OrdersUpdateComponent } from './orders-update.component';

describe('Component Tests', () => {
  describe('Orders Management Update Component', () => {
    let comp: OrdersUpdateComponent;
    let fixture: ComponentFixture<OrdersUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ordersService: OrdersService;
    let itemService: ItemService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrdersUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OrdersUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrdersUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ordersService = TestBed.inject(OrdersService);
      itemService = TestBed.inject(ItemService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Item query and add missing value', () => {
        const orders: IOrders = { id: 456 };
        const item: IItem = { id: 78819 };
        orders.item = item;

        const itemCollection: IItem[] = [{ id: 32174 }];
        spyOn(itemService, 'query').and.returnValue(of(new HttpResponse({ body: itemCollection })));
        const additionalItems = [item];
        const expectedCollection: IItem[] = [...additionalItems, ...itemCollection];
        spyOn(itemService, 'addItemToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ orders });
        comp.ngOnInit();

        expect(itemService.query).toHaveBeenCalled();
        expect(itemService.addItemToCollectionIfMissing).toHaveBeenCalledWith(itemCollection, ...additionalItems);
        expect(comp.itemsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const orders: IOrders = { id: 456 };
        const item: IItem = { id: 45215 };
        orders.item = item;

        activatedRoute.data = of({ orders });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(orders));
        expect(comp.itemsSharedCollection).toContain(item);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const orders = { id: 123 };
        spyOn(ordersService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ orders });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: orders }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ordersService.update).toHaveBeenCalledWith(orders);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const orders = new Orders();
        spyOn(ordersService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ orders });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: orders }));
        saveSubject.complete();

        // THEN
        expect(ordersService.create).toHaveBeenCalledWith(orders);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const orders = { id: 123 };
        spyOn(ordersService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ orders });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ordersService.update).toHaveBeenCalledWith(orders);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackItemById', () => {
        it('Should return tracked Item primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackItemById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
