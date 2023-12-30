import { createFeature, createReducer, on } from '@ngrx/store';
import { materialTypeActions } from './material-type.actions';
import { MaterialType } from '@models/material-type';

export interface MaterialTypeState {
  [id: string]: MaterialType;
}

const initialState: MaterialTypeState = {};

export const materialTypeFeature = createFeature({
  name: 'materialTypes',
  reducer: createReducer(
    initialState,
    on(materialTypeActions.setMaterialTypes, (state, { materialTypes }) => {
      return {
        ...materialTypes.reduce((current, item) => {
          return { ...current, [item.id]: item };
        }, {}),
      };
    }),
    on(materialTypeActions.updateMaterialType, (state, updatedProduct) => {
      return {
        ...state,
        [updatedProduct.id]: updatedProduct,
      };
    })
  ),
});

export const { name, reducer, selectMaterialTypesState } = materialTypeFeature;
