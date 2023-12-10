import { PlanTemplate } from '@models/plan';
import { createActionGroup, props } from '@ngrx/store';

export const planTemplateActions = createActionGroup({
	source: 'Plan data',
	events: {
		'Get plan templates': props<{ assetId: number }>(),
		'Set plan templates': props<{ templates: PlanTemplate[] }>(),
	},
});
