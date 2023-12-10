import { HeatingDemandReading } from '@feature/heating/services/heat-demand-api.service';
import {
	HeatStorageQueryParams,
	HeatStorageSingleDayQueryParams,
	HeatingStorageDataExtended,
	HeatingStorageReading,
} from '@feature/heating/services/heat-storage-api.service';
import { SolarHeatQueryParams } from '@feature/heating/services/solar-production-api.service';
import { HeatingData } from '@models/heating-data.model';
import { createActionGroup, props } from '@ngrx/store';
import { HeatingAssetState } from '@store/features/heating';

const heatingBidsEvents = {
	'Set heating bids': props<{ assetId: number; unitId: number; date: string; bids: HeatingData[] }>(),
	'Set derived heating bids': props<{ assetId: number; productionDate: string; data: HeatingData[] }>(),
	'Replace derived heating bids': props<{ assetId: number; unitId: number; productionDate: string; data: HeatingData[] }>(),
	'Replace predicted heating bids': props<{ assetId: number; unitId: number; productionDate: string; data: HeatingData[] }>(),
};

const heatingDemandEvents = {
	'Get heating demand data': props<{ assetId: number; productionDate: string; endDate?: string }>(),
	'Set all heating demand data': props<{
		assetId: number;
		actual: HeatingAssetState['heatingDemandData'];
		forecast: HeatingAssetState['heatingDemandForecastData'];
	}>(),
	'Append heating demand data': props<{ assetId: number; data: HeatingDemandReading }>(),
};

const heatingStorageEvents = {
	'Get heating storage data': props<HeatStorageQueryParams>(),
	'Set all heating storage data': props<{
		assetId: number;
		actual: HeatingAssetState['heatingStorageData'];
		forecast: HeatingAssetState['heatingStorageForecastData'];
	}>(),
	'Set heating storage data for single day': props<HeatStorageSingleDayQueryParams & { data: HeatingStorageDataExtended }>(),
	'Append heating storage data': props<{ assetId: number; data: HeatingStorageReading }>(),
};

const heatingSolarEvents = {
	'Get solar production data': props<SolarHeatQueryParams>(),
	'Set solar production forecast data': props<Pick<SolarHeatQueryParams, 'assetId'> & { data: any[] }>(),
};

export const heatingActions = createActionGroup({
	source: 'Heating',
	events: {
		...heatingBidsEvents,
		...heatingDemandEvents,
		...heatingStorageEvents,
		...heatingSolarEvents,
	},
});
