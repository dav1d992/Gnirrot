import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public registerMode = false;
  public responsiveOptions: any[];
  public users: any;
  constructor(private http: HttpClient) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '480px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnInit() {
    this.getUsers();
  }

  public toggleRegisterMode() {
    this.registerMode = !this.registerMode;
  }

  public getUsers() {
    this.http.get('http://localhost:5025/api/users').subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (err) => console.error(err),
      complete: () => {
        console.log('Request completed');
      },
    });
  }

  public cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
