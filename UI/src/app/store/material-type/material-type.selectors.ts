import { createSelector } from '@ngrx/store';
import {
  MaterialTypeState,
  selectMaterialTypesState,
} from './material-type.feature';

export const selectAllCategories = createSelector(
  selectMaterialTypesState,
  (state: MaterialTypeState) => Object.values(state)
);
