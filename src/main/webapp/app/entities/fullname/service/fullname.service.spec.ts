import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFullname, Fullname } from '../fullname.model';

import { FullnameService } from './fullname.service';

describe('Service Tests', () => {
  describe('Fullname Service', () => {
    let service: FullnameService;
    let httpMock: HttpTestingController;
    let elemDefault: IFullname;
    let expectedResult: IFullname | IFullname[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FullnameService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        firstName: 'AAAAAAA',
        lastName: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Fullname', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Fullname()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Fullname', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Fullname', () => {
        const patchObject = Object.assign({}, new Fullname());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Fullname', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Fullname', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFullnameToCollectionIfMissing', () => {
        it('should add a Fullname to an empty array', () => {
          const fullname: IFullname = { id: 123 };
          expectedResult = service.addFullnameToCollectionIfMissing([], fullname);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fullname);
        });

        it('should not add a Fullname to an array that contains it', () => {
          const fullname: IFullname = { id: 123 };
          const fullnameCollection: IFullname[] = [
            {
              ...fullname,
            },
            { id: 456 },
          ];
          expectedResult = service.addFullnameToCollectionIfMissing(fullnameCollection, fullname);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Fullname to an array that doesn't contain it", () => {
          const fullname: IFullname = { id: 123 };
          const fullnameCollection: IFullname[] = [{ id: 456 }];
          expectedResult = service.addFullnameToCollectionIfMissing(fullnameCollection, fullname);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fullname);
        });

        it('should add only unique Fullname to an array', () => {
          const fullnameArray: IFullname[] = [{ id: 123 }, { id: 456 }, { id: 9536 }];
          const fullnameCollection: IFullname[] = [{ id: 123 }];
          expectedResult = service.addFullnameToCollectionIfMissing(fullnameCollection, ...fullnameArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const fullname: IFullname = { id: 123 };
          const fullname2: IFullname = { id: 456 };
          expectedResult = service.addFullnameToCollectionIfMissing([], fullname, fullname2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fullname);
          expect(expectedResult).toContain(fullname2);
        });

        it('should accept null and undefined values', () => {
          const fullname: IFullname = { id: 123 };
          expectedResult = service.addFullnameToCollectionIfMissing([], null, fullname, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fullname);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
