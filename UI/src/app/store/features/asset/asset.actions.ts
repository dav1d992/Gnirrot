import { Plant } from '@models/plant.model';
import { createActionGroup, props } from '@ngrx/store';

export const assetActions = createActionGroup({
	source: 'Assets',
	events: {
		'Set available assets': props<{ assets: Plant[] }>(),
		'Set current asset': props<{ currentAsset: Plant }>(),
	},
});
