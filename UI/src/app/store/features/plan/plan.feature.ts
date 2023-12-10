import { DIRTY_STATE_TYPE, DirtyStateType } from '@feature/heating/services/planning-api.service';
import { deepObjectMerge } from '@helpers/deepObjectMerge';
import { toDateFormat } from '@helpers/toDate';
import { BlockBid } from '@models/bids/block-bid';
import { CapacityAuctionBid } from '@models/bids/capacity-auction-bid';
import { HourLimitationBid } from '@models/bids/hour-limitation-bid';
import { IntradayBid } from '@models/bids/intraday-bid';
import { MfrrEnergyBid } from '@models/bids/mfrr-energy-bid';
import { SpotBid } from '@models/bids/spot-bid';
import { HEAT_BID_TYPE, HeatBid } from '@models/heating-data.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ValidationError } from '@services/planning-validation.service';
import { planActions } from '@store/features/plan/plan.actions';
import { cloneDeep } from 'lodash';

const bidKeys: (keyof BidTypes)[] = ['mfrrEnergyBids', 'spotBids', 'blockBids', 'hourLimitationBids', 'capacityAuctionBids', 'intradayBids', 'heatBids'];

export type BidTypes = {
	mfrrEnergyBids: MfrrEnergyBid[];
	spotBids: SpotBid[];
	blockBids: BlockBid[];
	hourLimitationBids: HourLimitationBid[];
	capacityAuctionBids: CapacityAuctionBid[];
	intradayBids: IntradayBid[];
	heatBids: HeatBid[];
};

export type PlanState = {
	[assetId: number]: {
		[date: string]: {
			isLoading: boolean;
			lastEdited: string;
			validationErrors: ValidationError[];
			checksum: string;
			initial: BidTypes;
			dirty: BidTypes;
		};
	};
};

const initialState: PlanState = {};

export const planFeature = createFeature({
	name: 'plan',
	reducer: createReducer(
		initialState,
		on(planActions.clearPlan, () => initialState),
		on(planActions.clearPlanForDate, (state, { assetId, date }) => {
			const newState = cloneDeep(state);
			delete newState[assetId]?.[toDateFormat(date)];
			return newState;
		}),
		on(planActions.discardDirtyBids, (state: PlanState) => {
			const newState = cloneDeep(state);

			for (const assetId in newState) {
				for (const date in newState[assetId]) {
					if (newState[assetId][date]?.dirty) {
						newState[assetId][date].dirty = {
							mfrrEnergyBids: [],
							spotBids: [],
							blockBids: [],
							hourLimitationBids: [],
							capacityAuctionBids: [],
							intradayBids: [],
							heatBids: [],
						};
					}
				}
			}

			return newState;
		}),

		on(planActions.deleteBid, (state, { date, id }) => {
			const newState: PlanState = cloneDeep(state);

			for (const assetId in newState) {
				const assetState = newState[assetId][date];

				if (!assetState) continue;

				// Fill dirty state with empty arrays, if they don't exist
				assetState.dirty = deepObjectMerge(
					assetState.dirty,
					{ mfrrEnergyBids: [], spotBids: [], blockBids: [], hourLimitationBids: [], capacityAuctionBids: [], intradayBids: [], heatBids: [] },
					true,
				);

				bidKeys.forEach((key) => {
					// Check initial bids
					const initialList = assetState.initial[key];

					const bidFromInitialIndex = initialList?.findIndex((bid) => bid.id === id) ?? -1;
					if (bidFromInitialIndex !== -1) {
						(assetState.dirty[key] as Array<(typeof initialList)[0] & { dirtyState?: DirtyStateType }>).push({
							...initialList[bidFromInitialIndex],
							dirtyState: DIRTY_STATE_TYPE.Deleted,
						});
					}

					// Check dirty bids
					const dirtyList = assetState.dirty[key];
					if (dirtyList !== undefined) {
						const bidFromDirtyIndex = dirtyList.findIndex((bid) => bid.id === id);
						if (bidFromDirtyIndex !== -1 && bidFromInitialIndex === -1) {
							dirtyList.splice(bidFromDirtyIndex, 1);
						}
					}
				});
			}

			return newState;
		}),

		on(planActions.setIsLoading, (state, { assetId, date, isLoading }) => {
			return deepObjectMerge(state, {
				[assetId]: {
					[date]: {
						isLoading: isLoading,
					},
				},
			});
		}),
		on(planActions.setLastEdited, (state, { assetId, date, lastEdited }) => {
			return deepObjectMerge(state, {
				[assetId]: {
					[date]: {
						lastEdited: lastEdited,
					},
				},
			});
		}),
		on(planActions.setMfrrEnergyBids, (state, { assetId, date, bids }) => {
			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							initial: {
								mfrrEnergyBids: bids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.addMfrrEnergyBids, (state, { assetId, date, bids }) => {
			const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.mfrrEnergyBids || []);

			bids.forEach((bid) => {
				const existingBid = existingDirtyBids.find((existingDirtyBid) => existingDirtyBid.id === bid.id);

				if (existingBid !== undefined) {
					const index = existingDirtyBids.indexOf(existingBid);
					existingDirtyBids[index] = bid;
				} else {
					existingDirtyBids.push(bid);
				}
			});

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							dirty: {
								mfrrEnergyBids: existingDirtyBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.setSpotBids, (state, { assetId, date, bids }) => {
			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							initial: {
								spotBids: bids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.addSpotBids, (state, { assetId, date, bids }) => {
			const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.spotBids || []);

			bids.forEach((bid) => {
				const existingBid = existingDirtyBids.find((existingDirtyBid) => existingDirtyBid.id === bid.id);

				if (existingBid !== undefined) {
					const index = existingDirtyBids.indexOf(existingBid);
					existingDirtyBids[index] = bid;
				} else {
					existingDirtyBids.push(bid);
				}
			});

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							dirty: {
								spotBids: existingDirtyBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.setBlockBids, (state, { assetId, date, bids }) => {
			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							initial: {
								blockBids: bids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.addBlockBids, (state, { assetId, date, bids }) => {
			const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.blockBids || []);

			bids.forEach((bid) => {
				const existingBid = existingDirtyBids.find((existingDirtyBid) => existingDirtyBid.id === bid.id);

				if (existingBid !== undefined) {
					const index = existingDirtyBids.indexOf(existingBid);
					existingDirtyBids[index] = bid;
				} else {
					existingDirtyBids.push(bid);
				}
			});

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							dirty: {
								blockBids: existingDirtyBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.setHourLimitationBids, (state, { assetId, date, bids }) => {
			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							initial: {
								hourLimitationBids: bids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.addHourLimitationBids, (state, { assetId, date, bids }) => {
			const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.hourLimitationBids || []);

			bids.forEach((bid) => {
				const existingBid = existingDirtyBids.find((existingDirtyBid) => existingDirtyBid.id === bid.id);

				if (existingBid !== undefined) {
					const index = existingDirtyBids.indexOf(existingBid);
					existingDirtyBids[index] = bid;
				} else {
					existingDirtyBids.push(bid);
				}
			});

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							dirty: {
								hourLimitationBids: existingDirtyBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.setCapacityAuctionBids, (state, { assetId, date, bids }) => {
			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							initial: {
								capacityAuctionBids: bids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.addCapacityAuctionBids, (state, { assetId, date, bids }) => {
			const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.capacityAuctionBids || []);

			bids.forEach((bid) => {
				const existingBid = existingDirtyBids.find((existingDirtyBid) => existingDirtyBid.id === bid.id);

				if (existingBid !== undefined) {
					const index = existingDirtyBids.indexOf(existingBid);
					existingDirtyBids[index] = bid;
				} else {
					existingDirtyBids.push(bid);
				}
			});

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							dirty: {
								capacityAuctionBids: existingDirtyBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.setIntradayBids, (state, { assetId, date, bids }) => {
			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							initial: {
								intradayBids: bids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.setInitialHeatBids, (state, { assetId, date, bids }) => {
			const heatBids = bids.filter((bid) => bid.type === HEAT_BID_TYPE.Manual || bid.type === undefined);
			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							initial: {
								heatBids: heatBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.setHeatBid, (state, { assetId, date, bid }) => {
			const existingInitialBids = cloneDeep(state[assetId]?.[date]?.initial?.heatBids || []);
			const initialIndex = existingInitialBids.findIndex((initialBid) => initialBid.id === bid.id);

			if (initialIndex > -1) {
				existingInitialBids[initialIndex] = bid;
			} else {
				const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.heatBids || []);

				const dirtyIndex = existingDirtyBids.findIndex((dirtyBid) => dirtyBid.id === bid.id);
				if (dirtyIndex > -1) {
					existingDirtyBids[dirtyIndex] = bid;
				} else {
					existingDirtyBids.push(bid);
				}

				return deepObjectMerge(
					state,
					{
						[assetId]: {
							[date]: {
								dirty: {
									heatBids: existingDirtyBids,
								},
							},
						},
					},
					false,
				);
			}

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							initial: {
								heatBids: existingInitialBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.addHeatBids, (state, { assetId, date, bids }) => {
			const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.heatBids || []);

			bids.forEach((bid) => {
				const existingBid = existingDirtyBids.find((existingDirtyBid) => existingDirtyBid.id === bid.id);

				if (existingBid !== undefined) {
					const index = existingDirtyBids.indexOf(existingBid);
					existingDirtyBids[index] = bid;
				} else {
					existingDirtyBids.push(bid);
				}
			});

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							dirty: {
								heatBids: existingDirtyBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.appendHeatBids, (state, { assetId, date, bids }) => {
			const existingInitialBids = cloneDeep(state[assetId]?.[date]?.initial?.heatBids || []);
			const existingInitialHeatBids = existingInitialBids.concat(bids);

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							initial: {
								heatBids: existingInitialHeatBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.addIntradayBids, (state, { assetId, date, bids }) => {
			const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.intradayBids || []);

			bids.forEach((bid) => {
				const existingBid = existingDirtyBids.find((existingDirtyBid) => existingDirtyBid.id === bid.id);

				if (existingBid !== undefined) {
					const index = existingDirtyBids.indexOf(existingBid);
					existingDirtyBids[index] = bid;
				} else {
					existingDirtyBids.push(bid);
				}
			});

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							dirty: {
								intradayBids: existingDirtyBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.setChecksum, (state, { assetId, date, value }) => ({
			...state,
			[assetId]: {
				...state[assetId],
				[date]: {
					...state[assetId]?.[date],
					checksum: value,
				},
			},
		})),
		on(planActions.clearMfrrEnergyBids, (state, { date }) => {
			return deepObjectMerge(
				state,
				Object.fromEntries(
					Object.entries(state).map(([assetId, assetData]) => [
						assetId,
						{
							...assetData,
							[date]: {
								...(assetData[date] || {}),
								initial: {
									...((assetData[date] && assetData[date].initial) || {}),
									mfrrEnergyBids: [],
								},
							},
						},
					]),
				),
				false,
			);
		}),
		on(planActions.clearSpotBids, (state, { date }) => {
			return deepObjectMerge(
				state,
				Object.fromEntries(
					Object.entries(state).map(([assetId, assetData]) => [
						assetId,
						{
							...assetData,
							[date]: {
								...(assetData[date] || {}),
								initial: {
									...((assetData[date] && assetData[date].initial) || {}),
									spotBids: [],
								},
							},
						},
					]),
				),
				false,
			);
		}),
		on(planActions.clearBlockBids, (state, { date }) => {
			return deepObjectMerge(
				state,
				Object.fromEntries(
					Object.entries(state).map(([assetId, assetData]) => [
						assetId,
						{
							...assetData,
							[date]: {
								...(assetData[date] || {}),
								initial: {
									...((assetData[date] && assetData[date].initial) || {}),
									blockBids: [],
								},
							},
						},
					]),
				),
				false,
			);
		}),
		on(planActions.clearHourLimitationBids, (state, { date }) => {
			return deepObjectMerge(
				state,
				Object.fromEntries(
					Object.entries(state).map(([assetId, assetData]) => [
						assetId,
						{
							...assetData,
							[date]: {
								...(assetData[date] || {}),
								initial: {
									...((assetData[date] && assetData[date].initial) || {}),
									hourLimitationBids: [],
								},
							},
						},
					]),
				),
				false,
			);
		}),
		on(planActions.clearCapacityAuctionBids, (state, { date }) => {
			return deepObjectMerge(
				state,
				Object.fromEntries(
					Object.entries(state).map(([assetId, assetData]) => [
						assetId,
						{
							...assetData,
							[date]: {
								...(assetData[date] || {}),
								initial: {
									...((assetData[date] && assetData[date].initial) || {}),
									capacityAuctionBids: [],
								},
							},
						},
					]),
				),
				false,
			);
		}),
		on(planActions.clearIntradayBids, (state, { date }) => {
			return deepObjectMerge(
				state,
				Object.fromEntries(
					Object.entries(state).map(([assetId, assetData]) => [
						assetId,
						{
							...assetData,
							[date]: {
								...(assetData[date] || {}),
								initial: {
									...((assetData[date] && assetData[date].initial) || {}),
									intradayBids: [],
								},
							},
						},
					]),
				),
				false,
			);
		}),
		on(planActions.clearHeatBids, (state, { date }) => {
			return deepObjectMerge(
				state,
				Object.fromEntries(
					Object.entries(state).map(([assetId, assetData]) => [
						assetId,
						{
							...assetData,
							[date]: {
								...(assetData[date] || {}),
								initial: {
									...((assetData[date] && assetData[date].initial) || {}),
									heatBids: [],
								},
								dirty: {
									...((assetData[date] && assetData[date].dirty) || {}),
									heatBids: [],
								},
							},
						},
					]),
				),
				false,
			);
		}),
		on(planActions.removeHeatBid, (state, { assetId, date, bidId }) => {
			const existingInitialBids = cloneDeep(state[assetId]?.[date]?.initial?.heatBids || []);
			const initialIndex = existingInitialBids.findIndex((initialBid) => initialBid.id === bidId);

			const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.heatBids || []);
			const dirtyIndex = existingDirtyBids.findIndex((dirtyBid) => dirtyBid.id === bidId);

			let updatedState = deepObjectMerge(cloneDeep(state), {}, false);

			if (initialIndex > -1) {
				existingInitialBids.splice(initialIndex, 1);
				updatedState = deepObjectMerge(
					updatedState,
					{
						[assetId]: {
							[date]: {
								initial: {
									heatBids: existingInitialBids,
								},
							},
						},
					},
					false,
				);
			}

			if (dirtyIndex > -1) {
				existingDirtyBids.splice(dirtyIndex, 1);
				updatedState = deepObjectMerge(
					updatedState,
					{
						[assetId]: {
							[date]: {
								dirty: {
									heatBids: existingDirtyBids,
								},
							},
						},
					},
					false,
				);
			}

			return updatedState;
		}),
		on(planActions.removeDirtyHeatBid, (state, { assetId, date, bidId }) => {
			const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.heatBids || []);

			const index = existingDirtyBids.findIndex((initialBid) => initialBid.id === bidId);

			if (index > -1) {
				existingDirtyBids.splice(index, 1);
			}

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							dirty: {
								heatBids: existingDirtyBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.removeDirtyHeatBids, (state, { assetId, date, bidIds }) => {
			const existingDirtyBids = cloneDeep(state[assetId]?.[date]?.dirty?.heatBids || []).filter((existingBid) => !bidIds.includes(existingBid.id));

			existingDirtyBids.filter((existingBid) => !bidIds.includes(existingBid.id));

			return deepObjectMerge(
				state,
				{
					[assetId]: {
						[date]: {
							dirty: {
								heatBids: existingDirtyBids,
							},
						},
					},
				},
				false,
			);
		}),
		on(planActions.discardDirtyHeatBids, (state, { date }) => {
			const result = deepObjectMerge(
				state,
				Object.fromEntries(
					Object.entries(state).map(([assetId, assetData]) => [
						assetId,
						{
							...assetData,
							[date]: {
								...(assetData[date] || {}),
								dirty: {
									...((assetData[date] && assetData[date].dirty) || {}),
									heatBids: [],
								},
							},
						},
					]),
				),
				false,
			);
			return result;
		}),
		on(planActions.discardDirtyCreatedHeatBids, (state, { date }) => {
			const result = deepObjectMerge(
				state,
				Object.fromEntries(
					Object.entries(state).map(([assetId, assetData]) => [
						assetId,
						{
							...assetData,
							[date]: {
								...(assetData[date] || {}),
								dirty: {
									...((assetData[date] && assetData[date].dirty) || {}),
									heatBids: assetData[date]?.dirty?.heatBids.filter((bid) => bid.dirtyState !== DIRTY_STATE_TYPE.Created),
								},
							},
						},
					]),
				),
				false,
			);
			return result;
		}),
	),
});

export const { name, reducer, selectPlanState } = planFeature;
