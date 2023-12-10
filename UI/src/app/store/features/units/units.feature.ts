import { Unit } from '@models/unit.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { unitsActions } from './units.actions';

export interface UnitsState {
	[unitId: string]: Unit;
}

const initialState: UnitsState = {};

export const unitsFeature = createFeature({
	name: 'units',
	reducer: createReducer(
		initialState,

		on(unitsActions.setUnits, (state, { units }) => {
			return {
				...units.reduce((current, item) => {
					return { ...current, [item.UnitId]: item };
				}, {}),
			};
		}),
		on(unitsActions.updateUnit, (state, updatedUnit) => {
			return {
				...state,
				[updatedUnit.UnitId]: updatedUnit,
			};
		}),
	),
});

export const { name, reducer } = unitsFeature;
