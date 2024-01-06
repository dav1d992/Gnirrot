import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '@services/product.service';
import { Observable, map, mergeMap, switchMap, tap } from 'rxjs';
import { Action } from '@ngrx/store';
import { productActions } from './product.actions';
import { ToastService } from '@services/toast.service';
import { SEVERITY_LEVEL, ToastProps } from '@models/toast-props';

@Injectable()
export class ProductEffects {
  private readonly actions = inject(Actions);
  private readonly productService = inject(ProductService);
  private readonly toastService = inject(ToastService);

  loadProducts$ = createEffect(
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

  updateProduct$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(productActions.updateProduct),
        mergeMap((product) =>
          this.productService.updateProduct(product).pipe(
            tap(() => {
              this.toastService.showToast(<ToastProps>{
                title: 'Updated succesfully',
                description: `Product ${product.name} has been updated`,
                severity: SEVERITY_LEVEL.Success,
              });
            })
          )
        )
      ),
    { dispatch: false }
  );
}
