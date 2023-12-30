import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '@models/photo';
import { Store } from '@ngrx/store';
import { selectAllUsers } from '@store/user/user.selectors';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private storeUsers = this.store.selectSignal(selectAllUsers);

  public responsiveOptions = [
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

  public employee = computed(() => {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    return this.storeUsers().find((user) => user.shortName === username);
  });
}
