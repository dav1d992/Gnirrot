import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MaterialService } from '@services/material.service';
import { Observable, map, switchMap } from 'rxjs';
import { Action } from '@ngrx/store';
import { materialActions } from './material.actions';

@Injectable()
export class MaterialEffects {
  private readonly actions = inject(Actions);
  private readonly materialService = inject(MaterialService);

  loadMaterials = createEffect(
    (): Observable<Action> =>
      this.actions.pipe(
        ofType(materialActions.getMaterials),
        switchMap(() =>
          this.materialService
            .getMaterials()
            .pipe(
              map((materials) =>
                materialActions.setMaterials({ materials: materials })
              )
            )
        )
      )
  );
}
