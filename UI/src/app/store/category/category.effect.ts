import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoryService } from '@services/category.service';
import { Observable, map, switchMap } from 'rxjs';
import { Action } from '@ngrx/store';
import { categoryActions } from './category.actions';

@Injectable()
export class CategoryEffects {
  private readonly actions = inject(Actions);
  private readonly categoryService = inject(CategoryService);

  loadProducts = createEffect(
    (): Observable<Action> =>
      this.actions.pipe(
        ofType(categoryActions.getCategories),
        switchMap(() =>
          this.categoryService
            .getCategories()
            .pipe(
              map((categories) =>
                categoryActions.setCategories({ categories: categories })
              )
            )
        )
      )
  );
}
