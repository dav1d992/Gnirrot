import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SEVERITY_LEVEL, ToastProps } from '@models/toast-props';
import { AccountService } from '@services/account.service';
import { ToastService } from '@services/toast.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user) => {
        if (user) return true;
        else {
          this.toastService.showToast(<ToastProps>{
            title: 'Unauthorized',
            description: 'You shall not pass!!!!',
            lifetime: 10000,
            severity: SEVERITY_LEVEL.Error,
          });
          return false;
        }
      })
    );
  }
}
