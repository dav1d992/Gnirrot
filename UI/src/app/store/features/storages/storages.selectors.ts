import { Storage } from '@models/storage.model';
import { createSelector } from '@ngrx/store';
import { storagesFeature, StoragesState } from '@store/features/storages/storages.feature'; // change this path according to your project structure

export const selectSpecificStorageFromState = (storageId: number) =>
	createSelector(storagesFeature.selectStoragesState, (storagesState: StoragesState): Storage => {
		return storagesState[storageId];
	});

export const selectAllStorages = createSelector(storagesFeature.selectStoragesState, (storagesState: StoragesState) => Object.values(storagesState));
