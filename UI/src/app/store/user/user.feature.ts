import { createFeature, createReducer, on } from '@ngrx/store';
import { userActions } from './user.actions';
import { User } from '@models/user';

export interface UserState {
  [id: string]: User;
}

const initialState: UserState = {};

export const userFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,
    on(userActions.setUsers, (state, { users }) => {
      return {
        ...users.reduce((current, item) => {
          return { ...current, [item.id]: item };
        }, {}),
      };
    }),
    on(userActions.updateUser, (state, updatedUser) => {
      return {
        ...state,
        [updatedUser.id]: updatedUser,
      };
    })
  ),
});

export const { name, reducer, selectUsersState } = userFeature;
