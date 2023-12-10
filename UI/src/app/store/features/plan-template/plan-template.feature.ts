import { PlanTemplate } from '@models/plan';
import { createFeature, createReducer, on } from '@ngrx/store';
import { planTemplateActions } from '@store/features/plan-template/plan-template.actions';
import { cloneDeep } from 'lodash';

export type PlanTemplateState = {
	[assetId: number]: {
		templates: PlanTemplate[];
	};
};

const initialState: PlanTemplateState = {};

export const planTemplateFeature = createFeature({
	name: 'planTemplate',
	reducer: createReducer(
		initialState,
		on(planTemplateActions.setPlanTemplates, (state: PlanTemplateState, { templates }) => {
			const newState = cloneDeep(state);
			if (templates.length === 0) return newState;
			newState[templates[0].PlantId] = { templates };
			return newState;
		}),
	),
});

export const { name, reducer, selectPlanTemplateState } = planTemplateFeature;
