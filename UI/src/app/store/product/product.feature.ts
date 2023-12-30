import { createFeature, createReducer, on } from '@ngrx/store';
import { productActions } from './product.actions';
import { Product } from '@models/product';

export interface ProductState {
  [id: string]: Product;
}

const initialState: ProductState = {};

export const productFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialState,
    on(productActions.setProducts, (state, { products }) => {
      return {
        ...products.reduce((current, item) => {
          return { ...current, [item.id]: item };
        }, {}),
      };
    }),
    on(productActions.updateProduct, (state, updatedProduct) => {
      return {
        ...state,
        [updatedProduct.id]: updatedProduct,
      };
    })
  ),
});

export const { name, reducer, selectProductsState } = productFeature;
