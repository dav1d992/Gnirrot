import { toDateFormat } from '@helpers/toDate';
import { HeatingData } from '@models/heating-data.model';
import { Action } from '@ngrx/store';
import { heatingActions } from '@store/features/heating/heating.actions';
import { DateTime } from 'luxon';

export const handleInitialHeatingData = (assetId: number, data: HeatingData[]): Action[] => {
	// Group the heating data by production date and unit ID
	const groupedByDateAndUnit: Record<string, Record<number, HeatingData[]>> = data.reduce(
		(acc, heatData) => {
			const productionDate = heatData.ProductionDate;
			const unitId = heatData.UnitId;

			if (!acc[productionDate]) {
				acc[productionDate] = {};
			}

			if (!acc[productionDate][unitId]) {
				acc[productionDate][unitId] = [];
			}

			acc[productionDate][unitId].push(heatData);

			return acc;
		},
		{} as Record<string, Record<number, HeatingData[]>>,
	);

	// Convert the grouped data into actions
	return Object.entries(groupedByDateAndUnit).flatMap(([date, units]) =>
		Object.entries(units).flatMap(([unitIdStr, heatingDataArray]) =>
			heatingActions.setHeatingBids({
				assetId: assetId,
				unitId: parseInt(unitIdStr),
				date: toDateFormat(DateTime.fromISO(date)),
				bids: heatingDataArray,
			}),
		),
	);
};
