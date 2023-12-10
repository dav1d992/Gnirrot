import { BidType } from '@components/bid-type/bid-type.component';
import { PLAN_STATE_TYPE, PlanStateType } from '@components/plan-state/plan-state.component';
import { DIRTY_STATE_TYPE } from '@feature/heating/services/planning-api.service';
import { toDateFormat } from '@helpers/toDate';
import { BlockBid } from '@models/bids/block-bid';
import { CapacityAuctionBid } from '@models/bids/capacity-auction-bid';
import { HourLimitationBid } from '@models/bids/hour-limitation-bid';
import { IntradayBid } from '@models/bids/intraday-bid';
import { MfrrEnergyBid } from '@models/bids/mfrr-energy-bid';
import { SpotBid } from '@models/bids/spot-bid';
import { EnrichedHeatBid, HeatBid } from '@models/heating-data.model';
import { createSelector } from '@ngrx/store';
import { assetFeature } from '@store/features/asset';
import { selectPlanValidationErrors } from '@store/features/plan-validation/plan-validation.selectors';
import { bidTypeToCapacityProduct } from '@store/features/plan/helpers/bidTypeToCapacityProduct.helper';
import { mapBidTypeToBidTypesKey } from '@store/features/plan/helpers/mapBidTypeToBidTypesKey.helper';
import { sortedDirtyBids, sortedDirtyBidsForPlanBidTypes } from '@store/features/plan/helpers/sortedDirtyBids.helper';
import { BidTypes, planFeature } from '@store/features/plan/plan.feature';
import { uiFeature } from '@store/features/ui';
import { selectEnrichedUnitsState } from '@store/features/units/units.selectors';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';

export const selectPlanningDateIsInThePast = () =>
	createSelector(uiFeature.selectSelectedDates, (dates): boolean => {
		if (dates === undefined) return false;

		const planningDate = dates[0].set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
		const today = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

		return planningDate.valueOf() - today.valueOf() >= 0 ? false : true;
	});

export const selectPlanBidById = (id: string) =>
	createSelector(
		planFeature.selectPlanState,
		uiFeature.selectSelectedDates,
		(bids, dates): MfrrEnergyBid | SpotBid | BlockBid | HourLimitationBid | CapacityAuctionBid | IntradayBid | undefined => {
			if (dates === undefined) return;

			const date = toDateFormat(dates[0]);
			let bid: MfrrEnergyBid | SpotBid | BlockBid | HourLimitationBid | CapacityAuctionBid | IntradayBid | undefined = undefined;

			Object.keys(bids).forEach((assetId) => {
				if (bids[Number(assetId)] === undefined) return;
				const unitState = bids[Number(assetId)][date];

				// Did we find it on a previous unit? Return if we did
				if (bid !== undefined) return;

				// Check dirty bids
				bid = unitState?.dirty?.mfrrEnergyBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;

				bid = unitState?.dirty?.spotBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;

				bid = unitState?.dirty?.blockBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;

				bid = unitState?.dirty?.hourLimitationBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;

				bid = unitState?.dirty?.capacityAuctionBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;

				bid = unitState?.dirty?.intradayBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;
				// End check dirty bids

				// Check initial bids
				bid = unitState?.initial?.mfrrEnergyBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;

				bid = unitState?.initial?.spotBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;

				bid = unitState?.initial?.blockBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;

				bid = unitState?.initial?.hourLimitationBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;

				bid = unitState?.initial?.capacityAuctionBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;

				bid = unitState?.initial?.intradayBids?.find((bid) => bid.id === id);
				if (bid !== undefined) return;
				// End check initial bids
			});

			return bid;
		},
	);

export const selectPlanState = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		uiFeature.selectSelectedDates,
		planFeature.selectPlanState,
		selectPlanValidationErrors(),
		(currentAsset, selectedDates, bids, validationErrorsState): PlanStateType => {
			if (!currentAsset || Object.keys(currentAsset).length === 0) {
				return PLAN_STATE_TYPE.NoPlan;
			}

			const planningDate = toDateFormat(selectedDates[0]);

			const assetData = bids[currentAsset.PlantId];
			const validationErrors = validationErrorsState || [];
			const isLoading = assetData?.[planningDate]?.isLoading;

			if (isLoading === true) {
				return PLAN_STATE_TYPE.Loading;
			}

			if (validationErrors.length > 0) {
				return PLAN_STATE_TYPE.Invalid;
			}

			const isInitialPlanEmpty = !Object.values(bids).some((assetBids) =>
				Object.values(assetBids[planningDate]?.initial || {}).some((bidTypes) => bidTypes.length > 0),
			);

			const isDirtyPlanEmpty = !Object.values(bids).some((assetBids) =>
				Object.values(assetBids[planningDate]?.dirty || {}).some((bidTypes) => bidTypes.length > 0),
			);

			if (!isDirtyPlanEmpty) {
				return PLAN_STATE_TYPE.Draft;
			}

			if (isInitialPlanEmpty) {
				return PLAN_STATE_TYPE.NoPlan;
			}

			if (selectedDates[0].startOf('day') < DateTime.now().startOf('day')) {
				return PLAN_STATE_TYPE.FormerPlan;
			}

			return PLAN_STATE_TYPE.Active;
		},
	);

export const selectBids = <T>(bidType: BidType) =>
	createSelector(assetFeature.selectCurrentAsset, planFeature.selectPlanState, (currentAsset, planState): T => {
		if (!currentAsset || Object.keys(currentAsset).length === 0) return [] as T;
		const bidKey = mapBidTypeToBidTypesKey(bidType);

		const result: { [bidId: string]: Omit<BidTypes[typeof bidKey][number], 'capacityAuctionBids'> } = {};
		const assetData = cloneDeep(planState[currentAsset.PlantId]);

		if (assetData) {
			for (const dateData of Object.values(assetData)) {
				const initialBids = (dateData.initial?.[bidKey] || []) as BidTypes[typeof bidKey];
				const dirtyBids = (dateData.dirty?.[bidKey] || []) as BidTypes[typeof bidKey];

				initialBids.forEach((bid) => {
					result[`${bid.id}/${bid.date}`] = bid;
				});

				sortedDirtyBidsForPlanBidTypes(dirtyBids).forEach((bid) => {
					switch (bid.dirtyState) {
						case DIRTY_STATE_TYPE.Created:
						case DIRTY_STATE_TYPE.Edited:
							result[`${bid.id}/${bid.date}`] = bid;
							break;
						case DIRTY_STATE_TYPE.Deleted:
							delete result[`${bid.id}/${bid.date}`];
							break;
					}
				});
			}
		}

		return Object.values(result) as T;
	});

export const selectCapacityBids = (bidType?: BidType) =>
	createSelector(assetFeature.selectCurrentAsset, planFeature.selectPlanState, (currentAsset, planState) => {
		if (!currentAsset || Object.keys(currentAsset).length === 0) return [];

		const result: { [bidId: string]: CapacityAuctionBid } = {};
		const assetData = cloneDeep(planState[currentAsset.PlantId]);

		if (assetData) {
			for (const dateData of Object.values(assetData)) {
				const initialBids = dateData.initial?.capacityAuctionBids || [];
				const dirtyBids = dateData.dirty?.capacityAuctionBids || [];

				initialBids.forEach((bid) => {
					if (bidType ? bidTypeToCapacityProduct(bidType, bid.product) : true) {
						result[`${bid.id}/${bid.date}`] = bid;
					}
				});

				(<CapacityAuctionBid[]>sortedDirtyBidsForPlanBidTypes(dirtyBids)).forEach((bid) => {
					switch (bid.dirtyState) {
						case DIRTY_STATE_TYPE.Created:
						case DIRTY_STATE_TYPE.Edited:
							if (bidType ? bidTypeToCapacityProduct(bidType, bid.product) : true) {
								result[`${bid.id}/${bid.date}`] = bid;
							}
							break;
						case DIRTY_STATE_TYPE.Deleted:
							delete result[`${bid.id}/${bid.date}`];
							break;
					}
				});
			}
		}

		return Object.values(result);
	});

export const selectEnrichedHeatBids = () =>
	createSelector(
		assetFeature.selectCurrentAsset,
		planFeature.selectPlanState,
		selectEnrichedUnitsState(),
		(currentAsset, planState, unitsState): EnrichedHeatBid[] => {
			if (!currentAsset || Object.keys(currentAsset).length === 0 || planState === undefined) return [];

			const result: { [bidId: string]: EnrichedHeatBid } = {};
			const assetData = cloneDeep(planState[currentAsset.PlantId]);

			if (assetData) {
				for (const dateData of Object.values(assetData)) {
					const initialBids = (dateData.initial?.heatBids || []) as HeatBid[];
					const dirtyBids = (dateData.dirty?.heatBids || []) as HeatBid[];
					const units = Object.values(unitsState);

					initialBids.forEach((bid) => {
						result[`${bid.id}/${bid.date}`] = <EnrichedHeatBid>{
							...bid,
							readonly: false,
							unitName: units.find((unit) => unit.UnitId === bid.unitId)?.Name ?? '',
						};
					});

					sortedDirtyBids(dirtyBids).forEach((bid) => {
						switch (bid.dirtyState) {
							case DIRTY_STATE_TYPE.Created:
							case DIRTY_STATE_TYPE.Edited:
								result[`${bid.id}/${bid.date}`] = <EnrichedHeatBid>{
									...bid,
									readonly: false,
									unitName: units.find((unit) => unit.UnitId === bid.unitId)?.Name ?? '',
								};
								break;
							case DIRTY_STATE_TYPE.Deleted:
								delete result[`${bid.id}/${bid.date}`];
								break;
						}
					});
				}
			}

			return Object.values(result);
		},
	);

export const selectPlanIsLoading = () =>
	createSelector(assetFeature.selectCurrentAsset, uiFeature.selectSelectedDates, planFeature.selectPlanState, (currentAsset, selectedDates, plan): boolean => {
		if (!currentAsset || Object.keys(currentAsset).length === 0) return false;

		const planningDate = toDateFormat(selectedDates[0]);
		const assetData = plan[currentAsset.PlantId];

		return assetData?.[planningDate]?.isLoading || false;
	});

export const selectPlanLastEdited = () =>
	createSelector(assetFeature.selectCurrentAsset, uiFeature.selectSelectedDates, planFeature.selectPlanState, (currentAsset, selectedDates, plan): string => {
		if (!currentAsset || Object.keys(currentAsset).length === 0) return '';

		const planningDate = toDateFormat(selectedDates[0]);
		const assetData = plan[currentAsset.PlantId];

		return assetData?.[planningDate]?.lastEdited || '';
	});

export const selectChecksum = () =>
	createSelector(assetFeature.selectCurrentAsset, uiFeature.selectSelectedDates, planFeature.selectPlanState, (currentAsset, selectedDates, plan): string => {
		if (!currentAsset || Object.keys(currentAsset).length === 0) return '';

		const planningDate = toDateFormat(selectedDates[0]);
		const assetData = plan[currentAsset.PlantId];

		return assetData?.[planningDate]?.checksum || '';
	});

export const selectBidById = <T>(bidType: BidType, id: string) =>
	createSelector(assetFeature.selectCurrentAsset, planFeature.selectPlanState, (currentAsset, planState): T | undefined => {
		if (!currentAsset || Object.keys(currentAsset).length === 0) return undefined;

		const bidKey = mapBidTypeToBidTypesKey(bidType);

		let foundBid: BidTypes[typeof bidKey][number] | undefined;

		const assetData = cloneDeep(planState[currentAsset.PlantId]);

		if (assetData) {
			for (const dateData of Object.values(assetData)) {
				const initialBids = dateData.initial?.[bidKey] || [];
				const dirtyBids = dateData.dirty?.[bidKey] || [];

				foundBid = (initialBids as any[]).find((bid) => bid.id === id) || (dirtyBids as any[]).find((bid) => bid.id === id);

				if (foundBid) {
					break;
				}
			}
		}

		return foundBid as T;
	});

export const selectDirtyHeatBids = () =>
	createSelector(assetFeature.selectCurrentAsset, planFeature.selectPlanState, (currentAsset, planState): HeatBid[] => {
		if (!currentAsset || Object.keys(currentAsset).length === 0) return [];

		const result: { [bidId: string]: HeatBid } = {};

		const assetData = cloneDeep(planState[currentAsset.PlantId]);
		if (assetData) {
			for (const dateData of Object.values(assetData)) {
				const dirtyBids = (dateData.dirty?.heatBids || []) as HeatBid[];

				dirtyBids.forEach((bid) => {
					if (bid.dirtyState === DIRTY_STATE_TYPE.Deleted) {
						result[`${bid.id}/${bid.date}`] = bid;
					} else if (!result[`${bid.id}/${bid.date}`]) {
						result[`${bid.id}/${bid.date}`] = bid;
					}
				});
			}
		}

		return Object.values(result);
	});
