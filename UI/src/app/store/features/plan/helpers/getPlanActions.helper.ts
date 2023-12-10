import { toDateFormat } from '@helpers/toDate';
import { HeatingData } from '@models/heating-data.model';
import { Plan } from '@models/plan';
import { Action } from '@ngrx/store';
import { handleInitialHeatingData } from '@store/features/plan/helpers/handleInitialHeatingData.helper';
import { planActions } from '@store/features/plan/plan.actions';
import { BidBase } from '@store/features/plan/plan.effect';
import { DateTime } from 'luxon';

export const getPlanActions = (plan: Plan) => {
	const startDate = DateTime.fromISO(plan.startDate).toISODate();

	const mfrrEnergyBids = plan.mfrrEnergyBids;
	const spotBids = plan.spotBids;
	const mfrrCapacityBids = plan.mfrrCapacityBids;
	const blockBids = plan.blockBids;
	const hourLimitationBids = plan.hourLimitationBids;
	const primaryReserveBids = plan.primaryReserveBids;
	const capacityAuctionBids = plan.capacityAuctionBids;
	const intradayBids = plan.intradayBids;
	const checksum = plan.checksum;

	return [
		planActions.setLastEdited({ assetId: plan.plantId, date: toDateFormat(DateTime.fromISO(plan.startDate)), lastEdited: plan.lastEdited }),
		planActions.discardDirtyBids(),
		...groupAndCreateActions(mfrrEnergyBids, planActions.setMfrrEnergyBids, planActions.clearMfrrEnergyBids, plan.plantId, startDate),
		...groupAndCreateActions(spotBids, planActions.setSpotBids, planActions.clearSpotBids, plan.plantId, startDate),
		...groupAndCreateActions(mfrrCapacityBids, planActions.setMfrrCapacityBids, planActions.clearMfrrCapacityBids, plan.plantId, startDate),
		...groupAndCreateActions(blockBids, planActions.setBlockBids, planActions.clearBlockBids, plan.plantId, startDate),
		...groupAndCreateActions(hourLimitationBids, planActions.setHourLimitationBids, planActions.clearHourLimitationBids, plan.plantId, startDate),
		...groupAndCreateActions(primaryReserveBids, planActions.setPrimaryReserveBids, planActions.clearPrimaryReserveBids, plan.plantId, startDate),
		...groupAndCreateActions(capacityAuctionBids, planActions.setCapacityAuctionBids, planActions.clearCapacityAuctionBids, plan.plantId, startDate),
		...groupAndCreateActions(intradayBids, planActions.setIntradayBids, planActions.clearIntradayBids, plan.plantId, startDate),
		planActions.setChecksum({ assetId: plan.plantId, date: startDate, value: checksum }),
	];
};

export const getHeatDataActions = (assetId: number, heatingData: HeatingData[], startDate: string, endDate?: string) => {
	const start = DateTime.fromISO(startDate);
	const end = endDate ? DateTime.fromISO(endDate) : start;

	const actions: Action[] = [];

	let currentDate = start;

	while (currentDate <= end) {
		const currentDateString = toDateFormat(currentDate);

		const heatBidsForDay = heatingData
			.filter((bid) => toDateFormat(DateTime.fromISO(bid.ProductionDate)) === currentDateString)
			.map((bid) => ({
				id: bid.Id,
				unitId: bid.UnitId,
				date: toDateFormat(DateTime.fromISO(bid.ProductionDate)),
				dateGridPeriodId: bid.DateGridPeriodId,
				effect: {
					value: bid.Effect.Value,
					unit: bid.Effect.Unit,
				},
				type: bid.Type,
				dirtyState: bid.dirtyState,
			}));

		if (heatBidsForDay.length > 0) {
			actions.push(...groupAndCreateActions(heatBidsForDay, planActions.setInitialHeatBids, planActions.clearHeatBids, assetId, currentDateString));
		}

		currentDate = currentDate.plus({ days: 1 });
	}

	// For derived and predicted heat bids
	handleInitialHeatingData(assetId, heatingData);

	return actions;
};

export function groupAndCreateActions<T extends BidBase>(
	bids: T[],
	setAction: (params: { assetId: number; date: string; bids: T[] }) => Action,
	clearAction: (params: { date: string }) => Action,
	assetId: number,
	startDate: string,
): Action[] {
	const actions: Action[] = [];

	if (bids.length === 0) {
		actions.push(clearAction({ date: startDate }));
	} else {
		actions.push(setAction({ assetId, date: startDate, bids }));
	}

	return actions;
}
