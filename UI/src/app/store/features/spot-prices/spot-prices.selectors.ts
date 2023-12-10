import { toDateFormat } from '@helpers/toDate';
import { createSelector } from '@ngrx/store';
import { assetFeature } from '@store/features/asset';
import { spotPricesDataFeature } from '@store/features/spot-prices/spot-prices.feature';
import { uiFeature } from '@store/features/ui';

export const selectActualSpotPrices = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		uiFeature.selectSelectedDates,
		spotPricesDataFeature.selectSpotPricesDataState,
		(currentAsset, productionDates, spotPrices) => {
			if (
				currentAsset === undefined ||
				spotPrices === undefined ||
				productionDates === undefined ||
				Object.keys(currentAsset).length === 0 ||
				Object.keys(spotPrices).length === 0
			)
				return;

			const prices = spotPrices.dailySpotPrices[currentAsset.PowerPriceArea];
			if (prices === undefined) return {};
			return Object.assign(
				{},
				...productionDates.map((dateTime) => {
					return {
						[toDateFormat(dateTime)]: prices[toDateFormat(dateTime)],
					};
				}),
			);
		},
	);

export const selectSpotPriceForecasts = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		uiFeature.selectSelectedDates,
		spotPricesDataFeature.selectSpotPricesDataState,
		(currentAsset, productionDates, spotPrices) => {
			if (
				currentAsset === undefined ||
				spotPrices === undefined ||
				productionDates === undefined ||
				Object.keys(currentAsset).length === 0 ||
				Object.keys(spotPrices).length === 0
			)
				return {};

			const prices = spotPrices.dailySpotForecastPrices[currentAsset.PowerPriceArea];

			if (prices === undefined) return {};

			return Object.assign(
				{},
				...productionDates.map((dateTime) => {
					return {
						[toDateFormat(dateTime)]: prices[toDateFormat(dateTime)],
					};
				}),
			);
		},
	);
