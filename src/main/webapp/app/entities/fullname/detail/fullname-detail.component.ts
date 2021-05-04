import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFullname } from '../fullname.model';

@Component({
  selector: 'jhi-fullname-detail',
  templateUrl: './fullname-detail.component.html',
})
export class FullnameDetailComponent implements OnInit {
  fullname: IFullname | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fullname }) => {
      this.fullname = fullname;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
