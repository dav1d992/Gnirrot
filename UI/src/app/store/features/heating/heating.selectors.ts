import { HeatingDemandData } from '@feature/heating/services/heat-demand-api.service';
import { HeatingStorageDataExtended, HeatingStorageForecastDataOld } from '@feature/heating/services/heat-storage-api.service';
import { SolarProductionData } from '@feature/heating/services/solar-production-api.service';
import { toDateFormat } from '@helpers/toDate';
import { DateSeparatedHeatingData } from '@models/heating-data.model';
import { StoreHeatingBaseStructure } from '@models/store/heating/storeHeatingBaseStructure';
import { createSelector } from '@ngrx/store';
import { assetFeature } from '@store/features/asset';
import { HeatingAssetState, heatingFeature } from '@store/features/heating/heating.feature';
import { uiFeature } from '@store/features/ui';
import { selectEnrichedUnitsState } from '@store/features/units/units.selectors';
import { DateTime } from 'luxon';

export const selectHeatingPlanInitializationData = () =>
	createSelector(assetFeature.selectCurrentAsset, uiFeature.selectSelectedDates, (currentAsset, selectedDates) => {
		return { currentAsset, selectedDates };
	});

export const selectDerivedHeatBidsForDay = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		heatingFeature.selectHeatingState,
		selectEnrichedUnitsState(),
		uiFeature.selectSelectedDates,
		(currentAsset, heating, units, productionDates) => {
			const derivedHeatingBids = (heating[currentAsset.PlantId] as HeatingAssetState)?.derivedHeatingBids;

			if (
				currentAsset === undefined ||
				heating === undefined ||
				productionDates === undefined ||
				Object.keys(currentAsset).length === 0 ||
				Object.keys(units).length === 0 ||
				derivedHeatingBids === undefined
			)
				return {};

			const dateSeparatedHeatingData: DateSeparatedHeatingData = {};

			productionDates.forEach((dateTime) => {
				const dateStr = toDateFormat(dateTime);
				dateSeparatedHeatingData[dateStr] = [];

				Object.entries(derivedHeatingBids).forEach(([unitId, unitBids]) => {
					const bidsForDate = unitBids[dateStr];

					if (bidsForDate) {
						bidsForDate.forEach((bid) => {
							dateSeparatedHeatingData[dateStr].push({
								...bid,
								UnitName: units[Number(unitId)]?.Name ?? '',
								Readonly: true,
							});
						});
					}
				});
			});

			return dateSeparatedHeatingData;
		},
	);

export const selectPredictedHeatBidsForDay = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		heatingFeature.selectHeatingState,
		selectEnrichedUnitsState(),
		uiFeature.selectSelectedDates,
		(currentAsset, heating, units, productionDates) => {
			const predictedHeatingBids = (heating[currentAsset.PlantId] as HeatingAssetState)?.predictedHeatingBids;

			if (
				currentAsset === undefined ||
				heating === undefined ||
				productionDates === undefined ||
				Object.keys(currentAsset).length === 0 ||
				Object.keys(units).length === 0 ||
				predictedHeatingBids === undefined
			)
				return {};

			const dateSeparatedHeatingData: DateSeparatedHeatingData = {};

			productionDates.forEach((dateTime) => {
				const dateStr = toDateFormat(dateTime);
				dateSeparatedHeatingData[dateStr] = [];

				// Iterate through all unitIds for predictedHeatingBids
				Object.entries(predictedHeatingBids).forEach(([unitId, unitBids]) => {
					const bidsForDate = unitBids[dateStr];

					if (bidsForDate) {
						bidsForDate.forEach((bid) => {
							dateSeparatedHeatingData[dateStr].push({
								...bid,
								UnitName: units[Number(unitId)]?.Name ?? '',
								Readonly: false, // Assuming the Readonly value should be set to false; update as needed
							});
						});
					}
				});
			});

			return dateSeparatedHeatingData;
		},
	);

export const selectHeatingDemand = () =>
	createSelector(assetFeature.selectCurrentAsset, heatingFeature.selectHeatingState, uiFeature.selectSelectedDates, (currentAsset, heating, selectedDates) => {
		if (currentAsset === undefined || heating === undefined || selectedDates === undefined || Object.keys(currentAsset).length === 0) return {};

		const demandIds = Object.assign(
			{},
			...currentAsset.Demands.map((demand) => ({
				[demand.DemandId]: Object.assign(
					{},
					...selectedDates.map((date) => {
						const formattedDate = toDateFormat(date);

						const heatingDemandData = (heating[currentAsset.PlantId] as HeatingAssetState)?.heatingDemandData?.[demand.DemandId]?.[formattedDate];
						const heatingDemandForecastData = (heating[currentAsset.PlantId] as HeatingAssetState)?.heatingDemandForecastData?.[demand.DemandId]?.[
							formattedDate
						];

						return {
							[formattedDate]: {
								actual: heatingDemandData !== undefined ? { ...heatingDemandData } : undefined,
								forecast: heatingDemandForecastData !== undefined ? { ...heatingDemandForecastData } : undefined,
							},
						};
					}),
				),
			})),
		);

		return demandIds as StoreHeatingBaseStructure<HeatingDemandData, HeatingDemandData>;
	});

export const selectSolarProduction = () =>
	createSelector(assetFeature.selectCurrentAsset, heatingFeature.selectHeatingState, uiFeature.selectSelectedDates, (currentAsset, heating, selectedDates) => {
		if (currentAsset === undefined || heating === undefined || selectedDates === undefined || Object.keys(currentAsset).length === 0) return {};

		const unitIds = Object.assign(
			{},
			...currentAsset.Units.map((unit) => ({
				[unit.UnitId]: Object.assign(
					{},
					...selectedDates.map((date) => {
						const formattedDate = toDateFormat(date);

						const solarProductionForecastData = (heating[currentAsset.PlantId] as HeatingAssetState)?.solarProductionForecastData?.[unit.UnitId]?.[
							formattedDate
						];

						if (solarProductionForecastData === undefined)
							return {
								[formattedDate]: {
									forecast: undefined,
								},
							};

						const actual = {
							AssetId: solarProductionForecastData.AssetId,
							ProductionDate: solarProductionForecastData.ProductionDate,
							UnitId: solarProductionForecastData.UnitId,
							Points: solarProductionForecastData.Points.filter((point) => DateTime.fromISO(point.Timestamp) < DateTime.now()),
						};

						const forecastedPoints = solarProductionForecastData.Points.filter((point) => DateTime.fromISO(point.Timestamp) > DateTime.now());
						const forecast = {
							AssetId: solarProductionForecastData.AssetId,
							ProductionDate: solarProductionForecastData.ProductionDate,
							UnitId: solarProductionForecastData.UnitId,
							Points: forecastedPoints.length > 0 ? [actual.Points[actual.Points.length - 1], ...forecastedPoints] : [],
						};

						return {
							[formattedDate]: {
								actual: { ...actual },
								forecast: { ...forecast },
							},
						};
					}),
				),
			})),
		);

		return unitIds as StoreHeatingBaseStructure<SolarProductionData, SolarProductionData>;
	});

export const selectHeatingStorage = () =>
	createSelector(assetFeature.selectCurrentAsset, heatingFeature.selectHeatingState, uiFeature.selectSelectedDates, (currentAsset, heating, selectedDates) => {
		if (currentAsset === undefined || heating === undefined || selectedDates === undefined || Object.keys(currentAsset).length === 0) return {};

		const storageIds = Object.assign(
			{},
			...currentAsset.Storages.map((storage) => ({
				[storage.StorageId]: Object.assign(
					{},
					...selectedDates.map((date) => {
						const formattedDate = toDateFormat(date);

						const heatingStorageData = (heating[currentAsset.PlantId] as HeatingAssetState)?.heatingStorageData?.[storage.StorageId]?.[formattedDate];
						const heatingStorageForecastData = (heating[currentAsset.PlantId] as HeatingAssetState)?.heatingStorageForecastData?.[storage.StorageId]?.[
							formattedDate
						];
						const heatingStorageSimulationData = (heating[currentAsset.PlantId] as HeatingAssetState)?.heatingStorageSimulationData?.[storage.StorageId]?.[
							formattedDate
						];

						return {
							[formattedDate]: {
								actual: heatingStorageData !== undefined ? { ...heatingStorageData } : undefined,
								forecast: heatingStorageForecastData !== undefined ? { ...heatingStorageForecastData } : undefined,
								simulation: heatingStorageSimulationData !== undefined ? { ...heatingStorageSimulationData } : undefined,
							},
						};
					}),
				),
			})),
		);

		return storageIds as StoreHeatingBaseStructure<HeatingStorageDataExtended, HeatingStorageForecastDataOld>;
	});
