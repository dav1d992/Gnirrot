import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { storagesActions } from '@store/features/storages/storages.actions';
import { uiActions } from '@store/features/ui';
import { map } from 'rxjs';

@Injectable()
export class StoragesEffects {
	private readonly actions$ = inject(Actions);

	public setSelectedStorageIds$ = createEffect(() =>
		this.actions$.pipe(
			ofType(storagesActions.setStorages),
			map(({ storages }) => uiActions.setSelectedStorageIds({ storageIds: storages.map((storage) => storage.StorageId) })),
		),
	);
}
