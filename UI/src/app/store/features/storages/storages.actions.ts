import { Storage } from '@models/storage.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const storagesActions = createActionGroup({
	source: 'Storages',
	events: {
		'Set storages': props<{ storages: Array<Storage> }>(),
		'Get single storage': props<{ storageId: number }>(),
		'Update storage': props<Storage>(),
		'Get all storage': emptyProps(),
	},
});
