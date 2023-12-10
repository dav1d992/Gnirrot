import { createSelector } from '@ngrx/store';
import { UserState, selectUsersState } from './user.feature';

export const selectAllUsers = createSelector(
  selectUsersState,
  (state: UserState) => Object.values(state)
);
