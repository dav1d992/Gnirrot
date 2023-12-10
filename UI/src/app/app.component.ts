import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from './services/account.service';
import { Account } from './models/account';
import { userActions } from '@store/user';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly store = inject(Store);
  title = 'UI';

  ngOnInit(): void {
    // this.store.dispatch(userActions.getUsers());

    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: Account = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
