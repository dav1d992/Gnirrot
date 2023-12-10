import { Unit } from '@models/unit.model';
import { createActionGroup, props } from '@ngrx/store';

export const unitsActions = createActionGroup({
	source: 'Units',
	events: {
		'Set units': props<{ units: Array<Unit> }>(),
		'Get single unit': props<{ unitId: number }>(),
		'Update unit': props<Unit>(),
	},
});
