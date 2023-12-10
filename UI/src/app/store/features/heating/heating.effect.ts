import { Injectable, inject } from '@angular/core';
import { HeatDemandApiService } from '@feature/heating/services/heat-demand-api.service';
import { HeatStorageApiService } from '@feature/heating/services/heat-storage-api.service';
import { SolarProductionApiService } from '@feature/heating/services/solar-production-api.service';
import { Provide } from '@helpers/provide';
import { toDateFormat } from '@helpers/toDate';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HeatingApiService } from '@services/rest/heating-api.service';
import { HeatingAssetState, heatingActions } from '@store/features/heating';
import { planActions } from '@store/features/plan';
import { getHeatDataActions } from '@store/features/plan/helpers/getPlanActions.helper';
import { handleInitialHeatingData } from '@store/features/plan/helpers/handleInitialHeatingData.helper';
import { DateTime } from 'luxon';
import { concatMap, exhaustMap, forkJoin, map, mergeMap } from 'rxjs';

@Injectable()
export class HeatingEffects {
	private readonly actions$ = inject(Actions);
	private readonly heatingApiService = inject(HeatingApiService);
	private readonly heatDemandApiService = inject(HeatDemandApiService);
	private readonly heatStorageApiService = inject(HeatStorageApiService);
	private readonly solarProductionApiService = inject(SolarProductionApiService);

	public loadHeatingData$ = createEffect(() =>
		this.actions$.pipe(
			ofType(planActions.getHeatBids),
			exhaustMap(({ assetId, productionDate, endDate }) => {
				const queryParams = Provide.PlanningQueryParams.withAssetId(assetId).withProductionDate(productionDate).withEndDate(endDate).build();

				return forkJoin({
					initialData: this.heatingApiService.getHeatingData$(queryParams),
					heatData: this.heatingApiService.getHeatingData$(queryParams),
				}).pipe(
					map(({ initialData, heatData }) => [
						...handleInitialHeatingData(assetId, initialData),
						...getHeatDataActions(assetId, heatData, productionDate, endDate),
					]),
				);
			}),
			mergeMap((actions) => actions),
		),
	);

	public loadDemandData$ = createEffect(() =>
		this.actions$.pipe(
			ofType(heatingActions.getHeatingDemandData),
			concatMap(({ assetId, endDate, productionDate }) =>
				this.heatDemandApiService.getHeatDemandForProductionDate$({ assetId, endDate, productionDate }).pipe(
					map((demandData) => {
						const demandActual: HeatingAssetState['heatingDemandData'] = {};
						const demandForecast: HeatingAssetState['heatingDemandForecastData'] = {};

						demandData.forEach((demandData) => {
							if (Object.prototype.hasOwnProperty.call(demandActual, demandData.DemandId) === false) {
								demandActual[demandData.DemandId.toString()] = {};
							}
							if (Object.prototype.hasOwnProperty.call(demandForecast, demandData.DemandId) === false) {
								demandForecast[demandData.DemandId.toString()] = {};
							}

							const actualFromDemandData = demandActual[demandData.DemandId.toString()];
							const forecastFromDemandData = demandForecast[demandData.DemandId.toString()];

							if (Object.prototype.hasOwnProperty.call(actualFromDemandData, demandData.ActualData.ProductionDate) === false) {
								actualFromDemandData[toDateFormat(DateTime.fromISO(demandData.ActualData.ProductionDate))] = { ...demandData.ActualData };
							}
							if (Object.prototype.hasOwnProperty.call(forecastFromDemandData, demandData.ForecastData.ProductionDate) === false) {
								forecastFromDemandData[toDateFormat(DateTime.fromISO(demandData.ForecastData.ProductionDate))] = { ...demandData.ForecastData };
							}
						});

						return heatingActions.setAllHeatingDemandData({ assetId, actual: demandActual, forecast: demandForecast });
					}),
				),
			),
		),
	);

	public loadStorageData$ = createEffect(() =>
		this.actions$.pipe(
			ofType(heatingActions.getHeatingStorageData),
			concatMap(({ assetId, endDate, productionDate }) =>
				this.heatStorageApiService.getHeatStorageForProductionDate$({ assetId, endDate, productionDate }).pipe(
					map((heatingStorageData) => {
						const storageActual: HeatingAssetState['heatingStorageData'] = {};
						const storageForecast: HeatingAssetState['heatingStorageForecastData'] = {};

						heatingStorageData.forEach((storageData) => {
							if (Object.prototype.hasOwnProperty.call(storageActual, storageData.StorageId) === false) {
								storageActual[storageData.StorageId.toString()] = {};
							}
							if (Object.prototype.hasOwnProperty.call(storageForecast, storageData.StorageId) === false) {
								storageForecast[storageData.StorageId.toString()] = {};
							}

							const actualFromStorageData = storageActual[storageData.StorageId.toString()];
							const forecastFromStorageData = storageForecast[storageData.StorageId.toString()];

							if (Object.prototype.hasOwnProperty.call(actualFromStorageData, storageData.ActualData.ProductionDate) === false) {
								if (actualFromStorageData[toDateFormat(DateTime.fromISO(storageData.ActualData.ProductionDate))] === undefined) {
									actualFromStorageData[toDateFormat(DateTime.fromISO(storageData.ActualData.ProductionDate))] = { ...storageData.ActualData };
								}
							}
							if (Object.prototype.hasOwnProperty.call(forecastFromStorageData, storageData.ForecastData.ProductionDate) === false) {
								if (forecastFromStorageData[toDateFormat(DateTime.fromISO(storageData.ForecastData.ProductionDate))] === undefined) {
									forecastFromStorageData[toDateFormat(DateTime.fromISO(storageData.ForecastData.ProductionDate))] = { ...storageData.ForecastData };
								}
							}
						});

						return heatingActions.setAllHeatingStorageData({ assetId, actual: storageActual, forecast: storageForecast });
					}),
				),
			),
		),
	);

	public loadSolarData$ = createEffect(() =>
		this.actions$.pipe(
			ofType(heatingActions.getSolarProductionData),
			concatMap(({ assetId, productionDate, endDate }) =>
				this.solarProductionApiService
					.getSolarHeatForProductionDate$({ assetId, productionDate, endDate })
					.pipe(map((solarProductionData) => heatingActions.setSolarProductionForecastData({ assetId, data: solarProductionData }))),
			),
		),
	);
}
