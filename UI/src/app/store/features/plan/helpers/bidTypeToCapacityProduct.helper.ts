import { BidType } from '@components/bid-type/bid-type.component';
import { Product } from '@feature/planning-entry-page/capacity-product';

export const bidTypeToCapacityProduct = (bidType: BidType, productNum: number): boolean => {
	const product = new Product(productNum);
	switch (bidType) {
		case 'mfrrCapacity':
			return product.isMfrrD1Product();
		case 'frequencyReserveCapacity':
			return product.isFfrProduct();
		case 'primaryReserveCapacityFCR':
			return product.isFcrProduct();
		case 'primaryReserveCapacityFCRNEarly':
			return product.isFcrND1EProduct();
		case 'primaryReserveCapacityFCRDEarly':
			return product.isFcrDD1EProduct();
		case 'primaryReserveCapacityFCRNLate':
			return product.isFcrND1LProduct();
		case 'primaryReserveCapacityFCRDLate':
			return product.isFcrDD1LProduct();
		default:
			return false;
	}
};
