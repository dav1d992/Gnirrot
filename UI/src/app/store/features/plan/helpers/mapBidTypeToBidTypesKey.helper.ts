import { BidType } from '@components/bid-type/bid-type.component';

// A mapping function to map BID_TYPE to BidTypes keys
export const mapBidTypeToBidTypesKey = (bidType: BidType) => {
	switch (bidType) {
		case 'block':
			return 'blockBids';
		case 'spot':
			return 'spotBids';
		case 'limitation':
			return 'hourLimitationBids';
		case 'mfrrEnergy':
			return 'mfrrEnergyBids';
		case 'intraday':
			return 'intradayBids';
		case 'heat':
			return 'heatBids';
		default:
			throw new Error(`Unknown bidType: ${bidType}`);
	}
};
