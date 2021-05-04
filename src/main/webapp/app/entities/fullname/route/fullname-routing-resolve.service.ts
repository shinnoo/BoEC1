import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFullname, Fullname } from '../fullname.model';
import { FullnameService } from '../service/fullname.service';

@Injectable({ providedIn: 'root' })
export class FullnameRoutingResolveService implements Resolve<IFullname> {
  constructor(protected service: FullnameService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFullname> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fullname: HttpResponse<Fullname>) => {
          if (fullname.body) {
            return of(fullname.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Fullname());
  }
}
