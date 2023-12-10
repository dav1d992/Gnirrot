import { SpotPrice } from '@models/bids/spot-price';
import { createActionGroup, props } from '@ngrx/store';

export const spotPricesActions = createActionGroup({
	source: 'Spot prices data',
	events: {
		'Fetch Spot Prices': props<{ priceArea: string; startDate: string; endDate: string }>(),
		'Set loading': props<{ loading: boolean }>(),
		'Set Spot Prices': props<{ priceArea: string; date: string, data: SpotPrice[] }>(),
		'Set Spot Prices Forecasts': props<{ priceArea: string; date: string, data: SpotPrice[] }>(),
	},
});
