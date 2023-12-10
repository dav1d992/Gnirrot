import { Plant } from '@models/plant.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { assetActions } from '@store/features/asset/asset.actions';

export interface AssetState {
	assets: Plant[];
	currentAsset: Plant;
}

const localStorageCurrentAsset = localStorage.getItem('currentAsset') ?? '{}';

export const assetFeature = createFeature({
	name: 'assets',
	reducer: createReducer(
		{
			assets: [] as Plant[],
			currentAsset: JSON.parse(localStorageCurrentAsset),
		} as AssetState,

		on(assetActions.setCurrentAsset, (state, { currentAsset }) => {
			localStorage.setItem('currentAsset', JSON.stringify(currentAsset));

			return {
				assets: state.assets,
				currentAsset: currentAsset,
			};
		}),
		on(assetActions.setAvailableAssets, (state, { assets }) => {
			return { ...state, assets };
		}),
	),
});

export const { name, reducer, selectCurrentAsset, selectAssets } = assetFeature;
