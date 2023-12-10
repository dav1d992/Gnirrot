import { Injectable } from '@angular/core';
import { SpotPriceApiResponse, SpotPricesApiService } from '@feature/heating/services/spot-price-api.service';
import { toDateFormat } from '@helpers/toDate';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { spotPricesActions } from '@store/features/spot-prices/spot-prices.actions';
import { DateTime } from 'luxon';
import { exhaustMap, from, mergeMap } from 'rxjs';

@Injectable()
export class SpotPricesEffects {
	public loadSpotPrices$ = createEffect(() =>
		this.actions$.pipe(
			ofType(spotPricesActions.fetchSpotPrices),
			exhaustMap(({ priceArea, startDate, endDate }) =>
				this.spotPricesApiService
					.getSpotPrices$({
						priceArea,
						startDate: startDate,
						endDate: endDate,
					})
					.pipe(
						mergeMap((spotPrices: SpotPriceApiResponse[]) => {
							const actions = new Array<Action>();
							spotPrices.forEach((spotPrice: SpotPriceApiResponse) => {
								if (spotPrice.dailySpotPrices !== null && spotPrice.dailySpotPrices.length > 0) {
									actions.push(
										spotPricesActions.setSpotPrices({
											priceArea: priceArea,
											date: toDateFormat(DateTime.fromISO(spotPrice.dailySpotPrices[0].startDate)),
											data: spotPrice.dailySpotPrices,
										}),
									);
								}
								if (spotPrice.dailySpotForecastPrices !== null && spotPrice.dailySpotForecastPrices.length > 0) {
									actions.push(
										spotPricesActions.setSpotPricesForecasts({
											priceArea: priceArea,
											date: toDateFormat(DateTime.fromISO(spotPrice.dailySpotForecastPrices[0].startDate)),
											data: spotPrice.dailySpotForecastPrices,
										}),
									);
								}
							});

							return from(actions);
						}),
					),
			),
		),
	);

	constructor(
		private actions$: Actions,
		private spotPricesApiService: SpotPricesApiService,
	) {}
}
