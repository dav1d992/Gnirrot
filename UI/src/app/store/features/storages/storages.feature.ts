import { Storage } from '@models/storage.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { storagesActions } from './storages.actions';

export interface StoragesState {
	[storageId: number]: Storage;
}

const initialState: StoragesState = {};

export const storagesFeature = createFeature({
	name: 'storages',
	reducer: createReducer(
		initialState,

		on(storagesActions.setStorages, (state, { storages }) => {
			return {
				...storages.reduce((current, item) => {
					return { ...current, [item.StorageId]: item };
				}, {}),
			};
		}),
		on(storagesActions.updateStorage, (state, storage) => {
			return { ...state, [storage.StorageId]: storage };
		}),
		on(storagesActions.getSingleStorage, (state, { storageId }) => {
			return { ...state, [storageId]: state[storageId] };
		})
	),
});

export const { name, reducer, selectStoragesState } = storagesFeature;
