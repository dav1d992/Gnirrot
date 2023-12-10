import { HeatingDemandData } from '@feature/heating/services/heat-demand-api.service';
import { HeatingStorageData, HeatingStorageForecastData, HeatingStorageSimulationData } from '@feature/heating/services/heat-storage-api.service';
import { SolarProductionData } from '@feature/heating/services/solar-production-api.service';
import { deepObjectMerge } from '@helpers/deepObjectMerge';
import { toDateFormat } from '@helpers/toDate';
import { HEAT_BID_TYPE, HeatingData } from '@models/heating-data.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { DateTime } from 'luxon';
import { heatingActions } from './heating.actions';

export type HeatingAssetState = {
	derivedHeatingBids: {
		[unitId: number]: {
			[date: string]: HeatingData[];
		};
	};
	predictedHeatingBids: {
		[unitId: number]: {
			[date: string]: HeatingData[];
		};
	};
	heatingDemandData: {
		[demandId: string]: { [date: string]: HeatingDemandData };
	};
	heatingDemandForecastData: {
		[demandId: string]: { [date: string]: HeatingDemandData };
	};
	heatingStorageData: {
		[storageId: string]: { [date: string]: HeatingStorageData };
	};
	heatingStorageForecastData: {
		[storageId: string]: { [date: string]: HeatingStorageForecastData };
	};
	heatingStorageSimulationData: {
		[storageId: string]: { [date: string]: HeatingStorageSimulationData };
	};
	solarProductionForecastData: {
		[unitId: string]: { [date: string]: SolarProductionData };
	};
};

export interface HeatingState {
	loading: boolean;
	[asset: string]: boolean | HeatingAssetState;
}

const initialState: HeatingState = {
	loading: false,
};

export const heatingFeature = createFeature({
	name: 'heating',
	reducer: createReducer(
		initialState,
		on(heatingActions.setHeatingBids, (state, { assetId, unitId, date, bids }) => {
			const dateSeparatedDerivedHeatingBids: {
				[unitId: number]: {
					[date: string]: HeatingData[];
				};
			} = {};

			const dateSeparatedPredictedHeatingBids: {
				[unitId: number]: {
					[date: string]: HeatingData[];
				};
			} = {};

			bids.forEach((heatingData) => {
				let targetArray;

				if (heatingData.Type === HEAT_BID_TYPE.Manual || heatingData.Type === undefined) {
					return;
				}

				if (heatingData.Type == HEAT_BID_TYPE.Known) {
					targetArray = dateSeparatedDerivedHeatingBids;
				} else {
					targetArray = dateSeparatedPredictedHeatingBids;
				}

				if (!targetArray[unitId]) {
					targetArray[unitId] = {};
				}

				if (!targetArray[unitId][date]) {
					targetArray[unitId][date] = [];
				}

				targetArray[unitId][date].push(heatingData);
			});

			return deepObjectMerge(
				state,
				{
					loading: false,
					[assetId]: {
						derivedHeatingBids: dateSeparatedDerivedHeatingBids,
						predictedHeatingBids: dateSeparatedPredictedHeatingBids,
					},
				},
				false,
			);
		}),
		on(heatingActions.replaceDerivedHeatingBids, (state, { assetId, unitId, productionDate, data }) => {
			return deepObjectMerge(
				state,
				{
					loading: false,
					[assetId]: {
						derivedHeatingBids: {
							[unitId]: {
								[productionDate]: data,
							},
						},
					},
				},
				false,
			);
		}),
		on(heatingActions.replacePredictedHeatingBids, (state, { assetId, unitId, productionDate, data }) => {
			return deepObjectMerge(
				state,
				{
					loading: false,
					[assetId]: {
						predictedHeatingBids: {
							[unitId]: {
								[productionDate]: data,
							},
						},
					},
				},
				false,
			);
		}),
		on(heatingActions.setAllHeatingDemandData, (state, { assetId, actual, forecast }) => {
			return deepObjectMerge(
				state,
				{
					loading: false,
					[assetId]: {
						heatingDemandData: { ...actual },
						heatingDemandForecastData: { ...forecast },
					},
				},
				false,
			);
		}),
		on(heatingActions.setAllHeatingStorageData, (state, { assetId, actual, forecast }) => {
			return deepObjectMerge(
				state,
				{
					loading: false,
					[assetId]: {
						heatingStorageData: { ...actual },
						heatingStorageForecastData: { ...forecast },
					},
				},
				false,
			);
		}),
		on(heatingActions.setHeatingStorageDataForSingleDay, (state, { assetId, data, storageId }) =>
			deepObjectMerge(
				state,
				{
					loading: false,
					[assetId]: {
						heatingStorageForecastData: {
							[storageId]: {
								[toDateFormat(DateTime.fromISO(data.ProductionDate))]: data,
							},
						},
					},
				},
				false,
			),
		),
		on(heatingActions.setSolarProductionForecastData, (state, { assetId, data }) => {
			if (data === undefined || data === null) return state;
			let newState = { ...state };

			const unitIds = data.map((solarData) => solarData.UnitId);

			unitIds.forEach((unitId) => {
				newState = deepObjectMerge(
					state,
					{
						loading: false,
						[assetId]: {
							solarProductionForecastData: {
								[unitId]: Object.assign(
									{},
									...data
										.filter((solarData) => solarData.UnitId === unitId)
										.map((solarProductionForecastData) => {
											return { [toDateFormat(DateTime.fromISO(solarProductionForecastData.ProductionDate))]: solarProductionForecastData };
										}),
								),
							},
						},
					},
					false,
				);
			});

			return newState;
		}),
		on(heatingActions.appendHeatingDemandData, (state, { assetId, data }): HeatingState => {
			return deepObjectMerge(
				state,
				{
					[assetId]: {
						heatingDemandData: {
							[data.DemandId]: {
								[toDateFormat(DateTime.fromISO(data.MeasureTime))]: {
									Points: [{ Effect: data.Energy, Timestamp: data.MeasureTime }],
								},
							},
						},
					},
				},
				true,
			);
		}),
		on(heatingActions.appendHeatingStorageData, (state, { assetId, data }) => {
			return deepObjectMerge(
				state,
				{
					[assetId]: {
						heatingStorageData: {
							[data.StorageId]: {
								[toDateFormat(DateTime.fromISO(data.MeasureTime))]: {
									Points: [{ Energy: data.Energy, Timestamp: data.MeasureTime }],
								},
							},
						},
					},
				},
				true,
			);
		}),
	),
});

export const { name, reducer, selectLoading } = heatingFeature;
