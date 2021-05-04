import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FullnameDetailComponent } from './fullname-detail.component';

describe('Component Tests', () => {
  describe('Fullname Management Detail Component', () => {
    let comp: FullnameDetailComponent;
    let fixture: ComponentFixture<FullnameDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FullnameDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ fullname: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FullnameDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FullnameDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load fullname on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fullname).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
