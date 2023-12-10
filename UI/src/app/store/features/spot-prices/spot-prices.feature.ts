import { SpotPrice } from '@models/bids/spot-price';
import { createFeature, createReducer, on } from '@ngrx/store';
import { spotPricesActions } from '@store/features/spot-prices/spot-prices.actions';

export interface SpotPricesState {
	loading: boolean;
	dailySpotPrices: {
		[priceArea: string]: {
			[date: string]: SpotPrice[];
		};
	};
	dailySpotForecastPrices: {
		[priceArea: string]: {
			[date: string]: SpotPrice[];
		};
	};
}

const initialState: SpotPricesState = {
	loading: false,
	dailySpotPrices: {},
	dailySpotForecastPrices: {},
};

export const spotPricesDataFeature = createFeature({
	name: 'spotPricesData',
	reducer: createReducer(
		initialState,
		on(spotPricesActions.setLoading, (state, { loading }) => ({ ...state, loading })),
		on(spotPricesActions.setSpotPrices, (state, { priceArea, date, data }) => ({
			...state,
			dailySpotPrices: {
				...state.dailySpotPrices,
				[priceArea]: {
					...state.dailySpotPrices[priceArea],
					[date]: data
				}
			}
		})),
		on(spotPricesActions.setSpotPricesForecasts, (state, { priceArea, date, data }) => ({
			...state,
			dailySpotForecastPrices: {
				...state.dailySpotForecastPrices,
				[priceArea]: {
					...state.dailySpotForecastPrices[priceArea],
					[date]: data
				}
			}
		}))
	),
});

export const { name, reducer, selectLoading } = spotPricesDataFeature;
