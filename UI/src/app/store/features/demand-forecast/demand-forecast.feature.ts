import { Demand } from '@models/demand.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { demandForecastActions } from './demand-forecast.actions';

export interface DemandForecastState {
	[demandId: number]: Demand;
}

const initialState: DemandForecastState = {};

export const demandForecastFeature = createFeature({
	name: 'demandForecast',
	reducer: createReducer(
		initialState,

		on(demandForecastActions.setDemandForecast, (state, { demands }) => {
			return {
				...state,
				...demands.reduce((current, item) => {
					return { ...current, [item.DemandId]: item };
				}, {}),
			};
		})
	),
});

export const { name, reducer } = demandForecastFeature;
