import { MaterialType } from '@models/material-type';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const materialTypeActions = createActionGroup({
  source: 'MaterialTypes',
  events: {
    'Set materialTypes': props<{ materialTypes: Array<MaterialType> }>(),
    'Get materialTypes': emptyProps(),
    'Get single materialType': props<{ id: number }>(),
    'Update materialType': props<MaterialType>(),
  },
});
