import { Demand } from '@models/demand.model';
import { createActionGroup, props } from '@ngrx/store';

export const demandForecastActions = createActionGroup({
	source: 'DemandForecast',
	events: {
		'Set demand forecast': props<{ demands: Array<Demand> }>(),
		'Get single demand forecast': props<{ demandId: number }>(),
	},
});
