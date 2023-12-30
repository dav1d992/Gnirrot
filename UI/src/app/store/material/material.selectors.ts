import { createSelector } from '@ngrx/store';
import { MaterialState, selectMaterialsState } from './material.feature';

export const selectAllMaterials = createSelector(
  selectMaterialsState,
  (state: MaterialState) => Object.values(state)
);
