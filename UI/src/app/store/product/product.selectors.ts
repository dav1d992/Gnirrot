import { createSelector } from '@ngrx/store';
import { ProductState, selectProductsState } from './product.feature';

export const selectAllProducts = createSelector(
  selectProductsState,
  (state: ProductState) => Object.values(state)
);
