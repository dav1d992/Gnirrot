import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@models/user';
import { Photo } from '@models/photo';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  employee: User | undefined;
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
  images: Photo[] = [];

  ngOnInit(): void {
    this.loadEmployee();
  }

  loadEmployee() {
    var username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.userService.getUser(username).subscribe({
      next: (employee) => {
        this.employee = employee;
      },
    });
  }
}
