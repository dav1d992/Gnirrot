import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { MenuItem } from 'primeng/api';
import { AccountService } from 'src/app/services/account.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  public navOptions: MenuItem[] = [];
  public userOptions: MenuItem[] = [];
  public model: any = {};
  public darkMode = false;
  private user?: User;

  constructor(
    private accountService: AccountService,
    private themeService: ThemeService
  ) {}

  get currentUser(): User | undefined {
    return this.user ?? undefined;
  }
  set currentUser(value: User | undefined) {
    this.user = value;
    this.setNavOptions();
  }

  ngOnInit() {
    this.darkMode = this.themeService.isDarkMode();

    this.accountService.currentUser$.subscribe((user) => {
      if (user === null) this.user = undefined;
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
      },
    ];
    if (this.currentUser) {
      this.navOptions.splice(
        1,
        0,
        {
          label: 'Members',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/members'],
        },
        {
          label: 'Matches',
          icon: 'pi pi-fw pi-heart-fill',
        },
        {
          label: 'Messages',
          icon: 'pi pi-fw pi-comment',
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
      next: (response) => {
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
