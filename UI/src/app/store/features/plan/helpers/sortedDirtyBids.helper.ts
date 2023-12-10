import { BidTypes } from '@store/features/plan/plan.feature';

export const sortedDirtyBids = <T extends { dirtyState: string }>(dirtyBids: T[]) => {
	if (dirtyBids === undefined) return dirtyBids;
	if (dirtyBids.length === 1) return dirtyBids;

	const dirtyBidsToSort = [...dirtyBids];

	return dirtyBidsToSort.sort((a, b) => getDirtyStatePriority(a.dirtyState) - getDirtyStatePriority(b.dirtyState));
};

export const getDirtyStatePriority = (dirtyState: string) => {
	switch (dirtyState) {
		case 'created':
			return 1;
		case 'edited':
			return 2;
		case 'deleted':
			return 3;
		default:
			return 4;
	}
};

export const sortedDirtyBidsForPlanBidTypes = <K extends keyof BidTypes>(dirtyBids: BidTypes[K]) => {
	if (dirtyBids === undefined) return dirtyBids;
	if (dirtyBids.length === 1) return dirtyBids;

	const dirtyBidsToSort = [...dirtyBids];
	return dirtyBidsToSort.sort((a, b) => getDirtyStatePriority(a.dirtyState) - getDirtyStatePriority(b.dirtyState));
};
