import { createFeature, createReducer, on } from '@ngrx/store';
import { categoryActions } from './category.actions';
import { Category } from '@models/category';

export interface CategoryState {
  [id: string]: Category;
}

const initialState: CategoryState = {};

export const categoryFeature = createFeature({
  name: 'categories',
  reducer: createReducer(
    initialState,
    on(categoryActions.setCategories, (state, { categories }) => {
      return {
        ...categories.reduce((current, item) => {
          return { ...current, [item.id]: item };
        }, {}),
      };
    }),
    on(categoryActions.updateCategory, (state, updatedProduct) => {
      return {
        ...state,
        [updatedProduct.id]: updatedProduct,
      };
    })
  ),
});

export const { name, reducer, selectCategoriesState } = categoryFeature;
