import { Component, Input } from '@angular/core';
import { User } from '@models/user';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.scss'],
})
export class EmployeeCardComponent {
  @Input() public employee!: User;
}
