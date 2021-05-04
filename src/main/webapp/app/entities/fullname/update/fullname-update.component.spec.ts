jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FullnameService } from '../service/fullname.service';
import { IFullname, Fullname } from '../fullname.model';

import { FullnameUpdateComponent } from './fullname-update.component';

describe('Component Tests', () => {
  describe('Fullname Management Update Component', () => {
    let comp: FullnameUpdateComponent;
    let fixture: ComponentFixture<FullnameUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fullnameService: FullnameService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FullnameUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FullnameUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FullnameUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fullnameService = TestBed.inject(FullnameService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const fullname: IFullname = { id: 456 };

        activatedRoute.data = of({ fullname });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(fullname));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fullname = { id: 123 };
        spyOn(fullnameService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fullname });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fullname }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fullnameService.update).toHaveBeenCalledWith(fullname);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fullname = new Fullname();
        spyOn(fullnameService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fullname });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fullname }));
        saveSubject.complete();

        // THEN
        expect(fullnameService.create).toHaveBeenCalledWith(fullname);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fullname = { id: 123 };
        spyOn(fullnameService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fullname });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fullnameService.update).toHaveBeenCalledWith(fullname);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
