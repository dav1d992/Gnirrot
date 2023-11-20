import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastService } from '@services/toast.service';
import { SEVERITY_LEVEL, ToastProps } from '@models/toast-props';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastService: ToastService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }
                this.toastService.showToast(<ToastProps>{
                  title: 'Error',
                  description: modelStateErrors.flat().join('\r\n').toString(),
                  lifetime: 10000,
                  severity: SEVERITY_LEVEL.Error,
                });
              } else {
                this.toastService.showToast(<ToastProps>{
                  title: 'Error',
                  description: error.error,
                  lifetime: 10000,
                  severity: SEVERITY_LEVEL.Error,
                });
              }
              break;
            case 401:
              this.toastService.showToast(<ToastProps>{
                title: 'Unauthorized',
                description: 'You shall not pass! Hehe',
                lifetime: 10000,
                severity: SEVERITY_LEVEL.Error,
              });
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastService.showToast(<ToastProps>{
                title: 'Error',
                description: 'Something unexpected went wrong',
                lifetime: 10000,
                severity: SEVERITY_LEVEL.Error,
              });
              break;
          }
        }
        throw error;
      })
    );
  }
}
