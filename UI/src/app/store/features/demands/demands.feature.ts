import { Demand } from '@models/demand.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { demandsActions } from './demands.actions';

export interface DemandsState {
	[demandId: number]: Demand;
}

const initialState: DemandsState = {};

export const demandsFeature = createFeature({
	name: 'demands',
	reducer: createReducer(
		initialState,

		on(demandsActions.setDemands, (state, { demands }) => {
			return {
				...state,
				...demands.reduce((current, item) => {
					return { ...current, [item.DemandId]: item };
				}, {}),
			};
		}),
		on(demandsActions.updateDemand, (state, demand) => {
			return { ...state, [demand.DemandId]: demand };
		}),
	),
});

export const { name, reducer } = demandsFeature;
