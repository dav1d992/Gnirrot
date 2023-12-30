import { createFeature, createReducer, on } from '@ngrx/store';
import { materialActions } from './material.actions';
import { Material } from '@models/material';

export interface MaterialState {
  [id: string]: Material;
}

const initialState: MaterialState = {};

export const materialFeature = createFeature({
  name: 'materials',
  reducer: createReducer(
    initialState,
    on(materialActions.setMaterials, (state, { materials }) => {
      return {
        ...materials.reduce((current, item) => {
          return { ...current, [item.id]: item };
        }, {}),
      };
    }),
    on(materialActions.updateMaterial, (state, updatedMaterial) => {
      return {
        ...state,
        [updatedMaterial.id]: updatedMaterial,
      };
    })
  ),
});

export const { name, reducer, selectMaterialsState } = materialFeature;
