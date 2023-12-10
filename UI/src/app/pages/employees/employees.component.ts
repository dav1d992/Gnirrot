import { Component, OnInit, effect, inject } from '@angular/core';
import { User } from '@models/user';
import { Store } from '@ngrx/store';
import { userActions } from '@store/user';
import { selectAllUsers } from '@store/user/user.selectors';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent {
  private readonly store = inject(Store);

  private storeUsers = this.store.selectSignal(selectAllUsers);
  employees: User[] = [];

  constructor() {
    this.store.dispatch(userActions.getUsers());

    effect(() => {
      this.employees = this.storeUsers();
    });
  }
}
