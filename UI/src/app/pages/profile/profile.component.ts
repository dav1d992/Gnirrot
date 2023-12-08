import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Member } from '@models/member';
import { ToastProps } from '@models/toast-props';
import { User } from '@models/user';
import { AccountService } from '@services/account.service';
import { MembersService } from '@services/members.service';
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
  private readonly membersService = inject(MembersService);
  private readonly toastService = inject(ToastService);

  member: Member | undefined;
  user: User | null = null;
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

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => (this.user = user),
    });
    this.loadMember();
  }

  loadMember() {
    if (!this.user) return;
    this.membersService.getMember(this.user.userName).subscribe({
      next: (member) => (this.member = member),
    });
  }

  updateMember() {
    this.membersService.updateMember(this.editForm?.value).subscribe({
      next: (_) => {
        console.log('LOLOLOL');
        this.toastService.showToast(<ToastProps>{
          title: 'lol',
          description: 'lolol',
          severity: 'info',
        });
        this.editForm?.reset(this.member);
      },
    });
  }
}
