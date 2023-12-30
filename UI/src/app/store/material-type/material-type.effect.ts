import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, map, switchMap } from 'rxjs';
import { Action } from '@ngrx/store';
import { materialTypeActions } from './material-type.actions';
import { MaterialTypeService } from '@services/material-type.service';

@Injectable()
export class MaterialTypeEffects {
  private readonly actions = inject(Actions);
  private readonly materialTypeService = inject(MaterialTypeService);

  loadProducts = createEffect(
    (): Observable<Action> =>
      this.actions.pipe(
        ofType(materialTypeActions.getMaterialTypes),
        switchMap(() =>
          this.materialTypeService.getMaterialTypes().pipe(
            map((materialTypes) =>
              materialTypeActions.setMaterialTypes({
                materialTypes: materialTypes,
              })
            )
          )
        )
      )
  );
}
