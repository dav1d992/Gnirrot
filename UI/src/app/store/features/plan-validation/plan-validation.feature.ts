import { createFeature, createReducer, on } from '@ngrx/store';
import { ValidationError } from '@services/planning-validation.service';
import { planValidationActions } from '@store/features/plan-validation/plan-validation.actions';

export type PlanValidationState = {
	[assetId: number]: {
		[date: string]: {
			heatValidationErrors: ValidationError[];
			powerValidationErrors: ValidationError[];
		};
	};
};

const initialState: PlanValidationState = {};

export const planValidationFeature = createFeature({
	name: 'planvalidation',
	reducer: createReducer(
		initialState,
		on(planValidationActions.setHeatValidationErrors, (state, { assetId, date, validationErrors }) => ({
			...state,
			[assetId]: {
				...state[assetId],
				[date]: {
					...state[assetId]?.[date],
					heatValidationErrors: validationErrors,
				},
			},
		})),
		on(planValidationActions.setPowerValidationErrors, (state, { assetId, date, validationErrors }) => ({
			...state,
			[assetId]: {
				...state[assetId],
				[date]: {
					...state[assetId]?.[date],
					powerValidationErrors: validationErrors,
				},
			},
		})),
	),
});

export const { name, reducer } = planValidationFeature;
