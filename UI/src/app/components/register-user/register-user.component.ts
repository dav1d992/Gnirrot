import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent {
  private readonly accountService = inject(AccountService);
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  public register() {
    this.accountService.register(this.model).subscribe({
      next: () => {
        this.cancel();
      },
      error: (error) => console.log(error),
    });
  }

  public cancel() {
    this.cancelRegister.emit(false);
  }
}
