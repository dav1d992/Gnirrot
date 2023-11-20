import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastProps, SEVERITY_LEVEL } from '@models/toast-props';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss'],
})
export class TestErrorComponent implements OnInit {
  baseUrl = 'http://localhost:5025/api/';
  validationErrors: string[] = [];

  constructor(private http: HttpClient, private toastService: ToastService) {}

  ngOnInit(): void {}

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  get401Error() {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe({
      next: (response) => {
        this.toastService.showToast(<ToastProps>{
          title: 'Error',
          description: response.toString(),
          lifetime: 10000,
          severity: SEVERITY_LEVEL.Error,
        });
      },
      error: (error) => console.log(error),
    });
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + 'accounts/register', {}).subscribe({
      next: (response) => console.log(response),
      error: (error) => {
        this.validationErrors = error;
      },
    });
  }
}
