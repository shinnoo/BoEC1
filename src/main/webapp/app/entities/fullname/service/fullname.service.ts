import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFullname, getFullnameIdentifier } from '../fullname.model';

export type EntityResponseType = HttpResponse<IFullname>;
export type EntityArrayResponseType = HttpResponse<IFullname[]>;

@Injectable({ providedIn: 'root' })
export class FullnameService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/fullnames');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(fullname: IFullname): Observable<EntityResponseType> {
    return this.http.post<IFullname>(this.resourceUrl, fullname, { observe: 'response' });
  }

  update(fullname: IFullname): Observable<EntityResponseType> {
    return this.http.put<IFullname>(`${this.resourceUrl}/${getFullnameIdentifier(fullname) as number}`, fullname, { observe: 'response' });
  }

  partialUpdate(fullname: IFullname): Observable<EntityResponseType> {
    return this.http.patch<IFullname>(`${this.resourceUrl}/${getFullnameIdentifier(fullname) as number}`, fullname, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFullname>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFullname[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFullnameToCollectionIfMissing(fullnameCollection: IFullname[], ...fullnamesToCheck: (IFullname | null | undefined)[]): IFullname[] {
    const fullnames: IFullname[] = fullnamesToCheck.filter(isPresent);
    if (fullnames.length > 0) {
      const fullnameCollectionIdentifiers = fullnameCollection.map(fullnameItem => getFullnameIdentifier(fullnameItem)!);
      const fullnamesToAdd = fullnames.filter(fullnameItem => {
        const fullnameIdentifier = getFullnameIdentifier(fullnameItem);
        if (fullnameIdentifier == null || fullnameCollectionIdentifiers.includes(fullnameIdentifier)) {
          return false;
        }
        fullnameCollectionIdentifiers.push(fullnameIdentifier);
        return true;
      });
      return [...fullnamesToAdd, ...fullnameCollection];
    }
    return fullnameCollection;
  }
}
