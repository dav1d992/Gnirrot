import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '@services/product.service';
import { Observable, map, switchMap } from 'rxjs';
import { Action } from '@ngrx/store';
import { productActions } from './product.actions';

@Injectable()
export class ProductEffects {
  private readonly actions = inject(Actions);
  private readonly productService = inject(ProductService);

  loadProducts = createEffect(
    (): Observable<Action> =>
      this.actions.pipe(
        ofType(productActions.getProducts),
        switchMap(() =>
          this.productService
            .getProducts()
            .pipe(
              map((products) =>
                productActions.setProducts({ products: products })
              )
            )
        )
      )
  );
}
