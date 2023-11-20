import { Injectable } from '@angular/core';
import { SEVERITY_LEVEL, ToastProps } from '@models/toast-props';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  public showToast(props: ToastProps) {
    if (props.severity === SEVERITY_LEVEL.Error) {
      console.error(props.description);
    }

    this.messageService.add({
      severity: props.severity,
      summary: props.title,
      life: props?.lifetime,
      detail: props.description,
    });
  }
}
