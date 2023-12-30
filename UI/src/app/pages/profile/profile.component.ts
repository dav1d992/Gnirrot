import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '@models/user';
import { ToastProps } from '@models/toast-props';
import { Account } from '@models/account';
import { AccountService } from '@services/account.service';
import { UserService } from '@services/user.service';
import { ToastService } from '@services/toast.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  private readonly accountService = inject(AccountService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  public user: User | undefined;
  public account: Account | null = null;
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

  public ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => (this.account = user),
    });
    this.loadUser();
  }

  public loadUser() {
    if (!this.account) return;
    this.userService.getUser(this.account.userName).subscribe({
      next: (user) => (this.user = user),
    });
  }

  public updateUser() {
    this.userService.updateUser(this.editForm?.value).subscribe({
      next: (_) => {
        console.log('LOLOLOL');
        this.toastService.showToast(<ToastProps>{
          title: 'lol',
          description: 'lolol',
          severity: 'info',
        });
        this.editForm?.reset(this.user);
      },
    });
  }
}
