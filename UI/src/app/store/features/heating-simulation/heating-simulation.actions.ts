import { HeatStorageQueryParams, HeatStorageSingleDayQueryParams, HeatingStorageForecastData } from '@feature/heating/services/heat-storage-api.service';
import { HeatingData } from '@models/heating-data.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

const heatingSimulationStorageEvents = {
	'Get heating storage data': props<HeatStorageQueryParams>(),
	'Set heating storage simulation data for single day': props<HeatStorageSingleDayQueryParams & { data: HeatingStorageForecastData }>(),
	'Add simulated heat bids': props<{ assetId: number; unitId: number; date: string; bids: HeatingData[] }>(),
	'Remove simulated heat bid': props<{ assetId: number; date: string; id: string }>(),
	'Clear simulations': emptyProps(),
};

export const heatingSimulationActions = createActionGroup({
	source: 'HeatingSimulation',
	events: {
		...heatingSimulationStorageEvents,
	},
});
