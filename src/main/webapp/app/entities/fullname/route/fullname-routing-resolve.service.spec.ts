jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFullname, Fullname } from '../fullname.model';
import { FullnameService } from '../service/fullname.service';

import { FullnameRoutingResolveService } from './fullname-routing-resolve.service';

describe('Service Tests', () => {
  describe('Fullname routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FullnameRoutingResolveService;
    let service: FullnameService;
    let resultFullname: IFullname | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FullnameRoutingResolveService);
      service = TestBed.inject(FullnameService);
      resultFullname = undefined;
    });

    describe('resolve', () => {
      it('should return IFullname returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFullname = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFullname).toEqual({ id: 123 });
      });

      it('should return new IFullname if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFullname = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFullname).toEqual(new Fullname());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFullname = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFullname).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
