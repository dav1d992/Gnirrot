import { HeatingStorageSimulationData } from '@feature/heating/services/heat-storage-api.service';
import { toDateFormat } from '@helpers/toDate';
import { DateSeparatedHeatingData, HeatingData } from '@models/heating-data.model';
import { StoreHeatingSimulationBaseStructure } from '@models/store/heating/storeHeatingBaseStructure';
import { createSelector } from '@ngrx/store';
import { assetFeature } from '@store/features/asset';
import { HeatingSimulationAssetState, heatingSimulationFeature } from '@store/features/heating-simulation/heating-simulation.feature';
import { uiFeature } from '@store/features/ui';
import { selectEnrichedUnitsState } from '@store/features/units/units.selectors';

export const selectHeatingStorageSimulation = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		heatingSimulationFeature.selectHeatingSimulationState,
		uiFeature.selectSelectedDates,
		(currentAsset, heating, selectedDates) => {
			if (currentAsset === undefined || heating === undefined || selectedDates === undefined || Object.keys(currentAsset).length === 0) return;

			const storageIds = Object.assign(
				{},
				...currentAsset.Storages.map((storage) => ({
					[storage.StorageId]: Object.assign(
						{},
						...selectedDates.map((date) => {
							const formattedDate = toDateFormat(date);

							const heatingStorageSimulationData = (heating[currentAsset.PlantId] as HeatingSimulationAssetState)?.heatingStorageSimulationData?.[
								storage.StorageId
							]?.[formattedDate];

							return {
								[formattedDate]: {
									simulation: heatingStorageSimulationData !== undefined ? { ...heatingStorageSimulationData } : undefined,
								},
							};
						}),
					),
				})),
			);

			return storageIds as StoreHeatingSimulationBaseStructure<HeatingStorageSimulationData>;
		},
	);

export const selectSimulatedHeatBids = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		heatingSimulationFeature.selectHeatingSimulationState,
		selectEnrichedUnitsState(),
		uiFeature.selectSelectedDates,
		(currentAsset, heating, units, productionDates) => {
			const heatingAssetState = heating[currentAsset.PlantId] as HeatingSimulationAssetState;
			const heatingBids = heatingAssetState?.simulatedHeatingBids;

			const result: {
				[unitId: number]: {
					[date: string]: HeatingData[];
				};
			} = {};

			// Merge all heating bids (initial and dirty)
			for (const unitIdKey of Object.keys(heatingBids || {})) {
				const unitId = Number(unitIdKey);
				const bidsByUnit = heatingBids[unitId];
				if (bidsByUnit === undefined) continue;

				for (const [dateStr, bids] of Object.entries(bidsByUnit)) {
					const uniqueBids: {
						[bidId: string]: HeatingData;
					} = {};

					bids?.forEach((bid) => (uniqueBids[bid.Id] = bid));

					result[unitId] ??= {};
					result[unitId][dateStr] = Object.values(uniqueBids);
				}
			}

			if (
				currentAsset === undefined ||
				heating === undefined ||
				productionDates === undefined ||
				Object.keys(currentAsset).length === 0 ||
				Object.keys(units).length === 0
			)
				return {};

			const dateSeparatedHeatingData: DateSeparatedHeatingData = {};

			for (const unitIdKey of Object.keys(result)) {
				const unitId = Number(unitIdKey);
				productionDates.forEach((dateTime) => {
					const dateStr = toDateFormat(dateTime);
					if (!dateSeparatedHeatingData[dateStr]) {
						dateSeparatedHeatingData[dateStr] = [];
					}

					const unitBidsForDate = result[unitId][dateStr] ?? [];
					unitBidsForDate.forEach((bid) => {
						dateSeparatedHeatingData[dateStr].push({ ...bid, Readonly: false, UnitName: units[unitId]?.Name ?? '' });
					});
				});
			}

			return dateSeparatedHeatingData;
		},
	);
