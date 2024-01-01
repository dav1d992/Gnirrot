import {
  Component,
  ElementRef,
  ViewChild,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '@models/photo';
import { User } from '@models/user';
import { Store } from '@ngrx/store';
import { selectAllProducts } from '@store/product/product.selectors';
import { userActions } from '@store/user';
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
  private storeProducts = this.store.selectSignal(selectAllProducts);

  public userDetailsForm: FormGroup;

  public employee = computed(() => {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    return this.storeUsers().find((user) => user.shortName === username);
  });

  public performances = computed(() => {
    if (!this.employee() && this.storeProducts().length > 0) return;

    const relevantProducts = this.storeProducts().filter(
      (p) => p.employee.id === this.employee()!.id && p.ended != null
    );

    interface MonthCount {
      [key: string]: number;
    }

    // Group products by their ending month and count them
    const groupByMonth = relevantProducts.reduce<MonthCount>((acc, product) => {
      const month = product.ended!.getMonth();
      const year = product.ended!.getFullYear();
      const monthYearKey = `${year}-${month + 1}`;

      acc[monthYearKey] = (acc[monthYearKey] || 0) + 1;

      return acc;
    }, {});

    // Convert the grouped data to the desired array format
    const finalResult = Object.keys(groupByMonth).map((monthYearKey) => ({
      month: monthYearKey,
      ordersEnded: groupByMonth[monthYearKey],
    }));

    return finalResult;
  });

  constructor() {
    this.userDetailsForm = new FormGroup({
      shortName: new FormControl(
        this.employee()?.shortName,
        Validators.required
      ),
      firstName: new FormControl(
        this.employee()?.firstName,
        Validators.required
      ),
      lastName: new FormControl(this.employee()?.lastName, Validators.required),
      photoUrl: new FormControl(this.employee()?.photoUrl, Validators.required),
      joined: new FormControl(this.employee()?.joined, Validators.required),
      dateOfBirth: new FormControl(
        this.employee()?.dateOfBirth,
        Validators.required
      ),
      workplace: new FormControl(
        this.employee()?.workplace,
        Validators.required
      ),
    });

    effect(() => {
      if (this.employee()) {
        this.userDetailsForm = new FormGroup({
          shortName: new FormControl(
            this.employee()!.shortName,
            Validators.required
          ),
          firstName: new FormControl(
            this.employee()!.firstName,
            Validators.required
          ),
          lastName: new FormControl(
            this.employee()!.lastName,
            Validators.required
          ),
          photoUrl: new FormControl(
            this.employee()!.photoUrl,
            Validators.required
          ),
          joined: new FormControl(
            new Date(this.employee()!.joined),
            Validators.required
          ),
          dateOfBirth: new FormControl(
            new Date(this.employee()!.dateOfBirth),
            Validators.required
          ),
          workplace: new FormControl(
            this.employee()!.workplace,
            Validators.required
          ),
        });
      }
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

  public onSubmit() {
    const request: User = {
      id: this.employee()!.id,
      shortName: this.employee()!.shortName,
      firstName: this.userDetailsForm.value.firstName as string,
      lastName: this.userDetailsForm.value.lastName as string,
      dateOfBirth: this.userDetailsForm.value.dateOfBirth as Date,
      workplace: this.userDetailsForm.value.workplace as string,
      photoUrl: this.userDetailsForm.value.photoUrl as string,
      joined: this.employee()!.joined,
      role: this.employee()!.role,
    };
    this.store.dispatch(userActions.updateUser(request));
  }
}
