import { createActionGroup, props } from '@ngrx/store';
import { ValidationError } from '@services/planning-validation.service';

export const planValidationActions = createActionGroup({
	source: 'Plan validation data',
	events: {
		'Set Heat ValidationErrors': props<{ assetId: number; date: string; validationErrors: ValidationError[] }>(),
		'Set Power ValidationErrors': props<{ assetId: number; date: string; validationErrors: ValidationError[] }>(),
	},
});
