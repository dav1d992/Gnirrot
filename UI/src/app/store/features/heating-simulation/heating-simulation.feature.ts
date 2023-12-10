import { HeatingStorageForecastData } from '@feature/heating/services/heat-storage-api.service';
import { deepObjectMerge } from '@helpers/deepObjectMerge';
import { toDateFormat } from '@helpers/toDate';
import { HeatingData } from '@models/heating-data.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import { heatingSimulationActions } from './heating-simulation.actions';

export type HeatingSimulationAssetState = {
	heatingStorageSimulationData: {
		[storageId: string]: { [date: string]: HeatingStorageForecastData };
	};
	simulatedHeatingBids: {
		[unitId: number]: {
			[date: string]: HeatingData[];
		};
	};
};

export interface HeatingSimulationState {
	loading: boolean;
	[asset: string]: boolean | HeatingSimulationAssetState;
}

const initialState: HeatingSimulationState = {
	loading: false,
};

export const heatingSimulationFeature = createFeature({
	name: 'heatingSimulation',
	reducer: createReducer(
		{ ...initialState },
		on(heatingSimulationActions.clearSimulations, () => ({ ...initialState })),
		on(heatingSimulationActions.setHeatingStorageSimulationDataForSingleDay, (state, { assetId, data, storageId }) =>
			deepObjectMerge(
				state,
				{
					loading: false,
					[assetId]: {
						heatingStorageSimulationData: {
							[storageId]: {
								[toDateFormat(DateTime.fromISO(data.ProductionDate))]: data,
							},
						},
					},
				},
				false,
			),
		),
		on(heatingSimulationActions.setHeatingStorageSimulationDataForSingleDay, (state, { assetId, data, storageId }) =>
			deepObjectMerge(
				state,
				{
					loading: false,
					[assetId]: {
						heatingStorageSimulationData: {
							[storageId]: {
								[toDateFormat(DateTime.fromISO(data.ProductionDate))]: data,
							},
						},
					},
				},
				false,
			),
		),
		on(heatingSimulationActions.addSimulatedHeatBids, (state, { assetId, unitId, date, bids }) => {
			const existingAssetState = cloneDeep((state[assetId] as HeatingSimulationAssetState) || {});

			const existingHeatingBidsForUnitId = existingAssetState.simulatedHeatingBids?.[unitId] || {};

			const existingDirtyBids = existingHeatingBidsForUnitId[date] || [];

			bids.forEach((bid) => {
				const existingBid = existingDirtyBids.find((existingDirtyBid) => existingDirtyBid.Id === bid.Id);
				if (existingBid !== undefined) {
					const index = existingDirtyBids.indexOf(existingBid);
					existingDirtyBids[index] = bid;
				} else {
					existingDirtyBids.push(bid);
				}
			});

			const updatedAssetState: HeatingSimulationAssetState = {
				...existingAssetState,
				simulatedHeatingBids: {
					...existingAssetState.simulatedHeatingBids,
					[unitId]: {
						...existingHeatingBidsForUnitId,
						[date]: existingDirtyBids,
					},
				},
			};

			return {
				...state,
				[assetId]: updatedAssetState,
			};
		}),
		on(heatingSimulationActions.removeSimulatedHeatBid, (state, { assetId, date, id }) => {
			const existingAssetState = cloneDeep((state[assetId] as HeatingSimulationAssetState) || {});

			let updatedAssetState: HeatingSimulationAssetState = {
				...existingAssetState,
				simulatedHeatingBids: {
					...existingAssetState.simulatedHeatingBids,
				},
			};

			const simulatedHeatingBids = existingAssetState?.simulatedHeatingBids;

			if (simulatedHeatingBids !== undefined) {
				Object.keys(simulatedHeatingBids).forEach((unitId: string) => {
					const existingHeatingBidsForUnitId = simulatedHeatingBids?.[parseInt(unitId)] || {};

					const existingDirtyBids = existingHeatingBidsForUnitId[date] || [];

					updatedAssetState = {
						...existingAssetState,
						simulatedHeatingBids: {
							...simulatedHeatingBids,
							[unitId]: {
								...existingHeatingBidsForUnitId,
								[date]: existingDirtyBids.filter((bid) => bid.Id !== id),
							},
						},
					};
				});
			}

			return {
				...state,
				[assetId]: updatedAssetState,
			};
		}),
	),
});

export const { name, reducer, selectLoading } = heatingSimulationFeature;
