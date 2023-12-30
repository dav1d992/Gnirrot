import { createSelector } from '@ngrx/store';
import { CategoryState, selectCategoriesState } from './category.feature';

export const selectAllCategories = createSelector(
  selectCategoriesState,
  (state: CategoryState) => Object.values(state)
);
