import { Component, OnInit, inject } from '@angular/core';
import { Account } from '@models/account';
import { MenuItem } from 'primeng/api';
import { AccountService } from 'src/app/services/account.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly themeService = inject(ThemeService);
  private account?: Account;

  public navOptions: MenuItem[] = [];
  public userOptions: MenuItem[] = [];
  public model: any = {};
  public darkMode = false;

  get currentUser(): Account | undefined {
    return this.account ?? undefined;
  }
  set currentUser(value: Account | undefined) {
    this.account = value;
    this.setNavOptions();
  }

  ngOnInit() {
    this.darkMode = this.themeService.isDarkMode();

    this.accountService.currentUser$.subscribe((user) => {
      if (user === null) this.account = undefined;
      else {
        this.currentUser = user;
      }
    });
    this.setNavOptions();
    this.setUserOptions();
  }

  private setNavOptions() {
    this.navOptions = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/'],
        active: false,
      },
    ];
    if (this.currentUser) {
      this.navOptions.splice(
        1,
        0,
        {
          label: 'Employees',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/employees'],
          active: false,
        },
        {
          label: 'Products',
          icon: 'pi pi-fw pi-th-large',
          routerLink: ['/products'],
          active: true,
        },
        {
          label: 'Materials',
          icon: 'pi pi-fw pi-th-large',
          routerLink: ['/materials'],
          active: false,
        },
        {
          label: 'Statistics',
          icon: 'pi pi-fw pi-th-large',
          routerLink: ['/statistics'],
          active: false,
        }
      );
    }
  }

  private setUserOptions() {
    this.userOptions = [
      {
        label: 'Edit profile',
        icon: 'pi pi-fw pi-user-edit',
        routerLink: ['/profile'],
      },
      {
        label: 'Sign out',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
          this.signOut();
        },
      },
    ];
  }

  public login() {
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.setNavOptions();
      },
      error: (error) => console.log(error),
    });
  }

  public signOut() {
    this.accountService.signOut();
    this.setNavOptions();
  }

  public toggleTheme() {
    this.darkMode = !this.darkMode;
    const lightOrDark = this.darkMode ? 'dark' : 'light';
    this.themeService.setTheme(`bootstrap4-${lightOrDark}-blue`);
  }
}
