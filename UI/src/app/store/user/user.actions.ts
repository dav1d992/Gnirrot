import { User } from '@models/user';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const userActions = createActionGroup({
  source: 'Users',
  events: {
    'Set users': props<{ users: Array<User> }>(),
    'Get users': emptyProps(),
    'Get single user': props<{ id: number }>(),
    'Update user': props<User>(),
  },
});
