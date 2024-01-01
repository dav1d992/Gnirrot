import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '@services/user.service';
import {
  EMPTY,
  Observable,
  catchError,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs';
import { userActions } from './user.actions';
import { Action } from '@ngrx/store';
import { ToastService } from '@services/toast.service';
import { SEVERITY_LEVEL, ToastProps } from '@models/toast-props';

@Injectable()
export class UserEffects {
  private readonly actions = inject(Actions);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  loadUsers$ = createEffect(
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

  updateUser$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(userActions.updateUser),
        mergeMap((user) =>
          this.userService.updateUser(user).pipe(
            tap(() => {
              this.toastService.showToast(<ToastProps>{
                title: 'Updated succesfully',
                description: `User ${user.shortName.toLocaleUpperCase()} has been updated`,
                severity: SEVERITY_LEVEL.Success,
              });
            })
          )
        )
      ),
    { dispatch: false }
  );
}
