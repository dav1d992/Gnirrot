import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Account } from '../models/account';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly http = inject(HttpClient);
  private currentUserSource = new BehaviorSubject<Account | null>(null);

  currentUser$ = this.currentUserSource.asObservable();
  baseUrl = environment.apiUrl;

  public login(model: any) {
    return this.http.post<Account>(this.baseUrl + 'accounts/login', model).pipe(
      map((response: Account) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  public signOut() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  public setCurrentUser(user: Account) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  public register(model: any) {
    return this.http
      .post<Account>(this.baseUrl + 'accounts/register', model)
      .pipe(
        map((user) => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user);
          }
        })
      );
  }
}
