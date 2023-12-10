import { BlockBid } from '@models/bids/block-bid';
import { CapacityAuctionBid } from '@models/bids/capacity-auction-bid';
import { HourLimitationBid } from '@models/bids/hour-limitation-bid';
import { IntradayBid } from '@models/bids/intraday-bid';
import { MfrrCapacityBid } from '@models/bids/mfrr-capacity.bid';
import { MfrrEnergyBid } from '@models/bids/mfrr-energy-bid';
import { PrimaryReserveBid } from '@models/bids/primary-reserve.bid';
import { SpotBid } from '@models/bids/spot-bid';
import { HeatBid } from '@models/heating-data.model';
import { HeatingBidDeleteBody } from '@models/heating/heating-bid-delete-body';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DateTime } from 'luxon';

const clearBidEvents = {
	'Clear MfrrEnergyBids': props<{ date: string }>(),
	'Clear SpotBids': props<{ date: string }>(),
	'Clear MfrrCapacityBids': props<{ date: string }>(),
	'Clear BlockBids': props<{ date: string }>(),
	'Clear HourLimitationBids': props<{ date: string }>(),
	'Clear PrimaryReserveBids': props<{ date: string }>(),
	'Clear CapacityAuctionBids': props<{ date: string }>(),
	'Clear IntradayBids': props<{ date: string }>(),
	'Clear HeatBids': props<{ date: string }>(),
};

export const planActions = createActionGroup({
	source: 'Plan data',
	events: {
		'Get plan': props<{ assetId: number; productionDates: DateTime[] }>(),
		'Clear plan': emptyProps(),
		'Clear plan for date': props<{ assetId: number; date: DateTime }>(),
		'Discard dirty bids': emptyProps(),
		'Discard dirty heat bids': props<{ date: string }>(),
		'Discard dirty created heat bids': props<{ date: string }>(),
		'Delete bid': props<{ date: string; id: string }>(),
		'Set last edited': props<{ assetId: number; date: string; lastEdited: string }>(),
		'Set is loading': props<{ assetId: number; date: string; isLoading: boolean }>(),
		'Set MfrrEnergyBids': props<{ assetId: number; date: string; bids: MfrrEnergyBid[] }>(),
		'Set SpotBids': props<{ assetId: number; date: string; bids: SpotBid[] }>(),
		'Set MfrrCapacityBids': props<{ assetId: number; date: string; bids: MfrrCapacityBid[] }>(),
		'Set BlockBids': props<{ assetId: number; date: string; bids: BlockBid[] }>(),
		'Set HourLimitationBids': props<{ assetId: number; date: string; bids: HourLimitationBid[] }>(),
		'Set PrimaryReserveBids': props<{ assetId: number; date: string; bids: PrimaryReserveBid[] }>(),
		'Set CapacityAuctionBids': props<{ assetId: number; date: string; bids: CapacityAuctionBid[] }>(),
		'Set IntradayBids': props<{ assetId: number; date: string; bids: IntradayBid[] }>(),
		'Set initial HeatBids': props<{ assetId: number; date: string; bids: HeatBid[] }>(),
		'Set HeatBid': props<{ assetId: number; date: string; bid: HeatBid }>(),
		'Set Checksum': props<{ assetId: number; date: string; value: string }>(),
		'Add SpotBids': props<{ assetId: number; date: string; bids: SpotBid[] }>(),
		'Add IntradayBids': props<{ assetId: number; date: string; bids: IntradayBid[] }>(),
		'Add BlockBids': props<{ assetId: number; date: string; bids: BlockBid[] }>(),
		'Add HourLimitationBids': props<{ assetId: number; date: string; bids: HourLimitationBid[] }>(),
		'Add CapacityAuctionBids': props<{ assetId: number; date: string; bids: CapacityAuctionBid[] }>(),
		'Add MfrrEnergyBids': props<{ assetId: number; date: string; bids: MfrrEnergyBid[] }>(),
		'Add HeatBids': props<{ assetId: number; date: string; bids: Array<HeatBid> }>(),
		'Remove HeatBid': props<{ assetId: number; date: string; bidId: string }>(),
		'Remove Dirty HeatBid': props<{ assetId: number; date: string; bidId: string }>(),
		'Remove Dirty HeatBids': props<{ assetId: number; date: string; bidIds: Array<string> }>(),
		'Append HeatBids': props<{ assetId: number; date: string; bids: HeatBid[] }>(),
		'Get HeatBids': props<{ assetId: number; productionDate: string; endDate?: string }>(),
		'Request post heat bids': props<{ assetId: number; date: string; bids: HeatBid[] }>(),
		'Request post extend heat bids': props<{ assetId: number; startDate: string; endDate: string; bids: HeatBid[] }>(),
		'Request update heat bids': props<{ assetId: number; date: string; bids: HeatBid[] }>(),
		'Request delete heat bids': props<{ assetId: number; date: string; bids: HeatingBidDeleteBody[] }>(),
		...clearBidEvents,
	},
});
