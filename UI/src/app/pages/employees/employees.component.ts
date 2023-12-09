import { Component, OnInit, inject } from '@angular/core';
import { User } from '@models/user';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  private readonly userService = inject(UserService);
  employees: User[] = [];

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.userService.getUsers().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
    });
  }
}
