import { Material } from '@models/material';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const materialActions = createActionGroup({
  source: 'Materials',
  events: {
    'Set materials': props<{ materials: Array<Material> }>(),
    'Get materials': emptyProps(),
    'Get single material': props<{ id: number }>(),
    'Update material': props<Material>(),
  },
});
