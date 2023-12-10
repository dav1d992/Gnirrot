import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '@services/user.service';
import { Observable, map, switchMap, tap } from 'rxjs';
import { userActions } from './user.actions';
import { Action } from '@ngrx/store';

@Injectable()
export class UserEffects {
  private readonly actions = inject(Actions);
  private readonly userService = inject(UserService);

  loadUsers = createEffect(
    (): Observable<Action> =>
      this.actions.pipe(
        ofType(userActions.getUsers),
        switchMap(() =>
          this.userService
            .getUsers()
            .pipe(map((users) => userActions.setUsers({ users: users })))
        )
      )
  );
}
