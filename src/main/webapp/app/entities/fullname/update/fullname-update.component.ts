import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFullname, Fullname } from '../fullname.model';
import { FullnameService } from '../service/fullname.service';

@Component({
  selector: 'jhi-fullname-update',
  templateUrl: './fullname-update.component.html',
})
export class FullnameUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
  });

  constructor(protected fullnameService: FullnameService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fullname }) => {
      this.updateForm(fullname);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fullname = this.createFromForm();
    if (fullname.id !== undefined) {
      this.subscribeToSaveResponse(this.fullnameService.update(fullname));
    } else {
      this.subscribeToSaveResponse(this.fullnameService.create(fullname));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFullname>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(fullname: IFullname): void {
    this.editForm.patchValue({
      id: fullname.id,
      firstName: fullname.firstName,
      lastName: fullname.lastName,
    });
  }

  protected createFromForm(): IFullname {
    return {
      ...new Fullname(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
    };
  }
}
