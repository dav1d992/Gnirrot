import { Demand } from '@models/demand.model';
import { createActionGroup, props } from '@ngrx/store';

export const demandsActions = createActionGroup({
	source: 'Demands',
	events: {
		'Set demands': props<{ demands: Array<Demand> }>(),
		'Get single demand': props<{ demandId: number }>(),
		'Update demand': props<Demand>(),
	},
});
