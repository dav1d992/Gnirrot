import { Component, computed, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  userDetailsForm: FormGroup;

  constructor() {
    this.userDetailsForm = new FormGroup({
      id: new FormControl(null, Validators.required),
      shortName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      photoUrl: new FormControl('', Validators.required),
      joined: new FormControl(null, Validators.required),
      dateOfBirth: new FormControl(null, Validators.required),
      workplace: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
    });
  }
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

  onSubmit() {
    console.log('Form Data: ', this.userDetailsForm.value);
  }
}
