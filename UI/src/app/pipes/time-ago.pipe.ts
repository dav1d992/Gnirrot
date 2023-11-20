import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const date = DateTime.fromISO(value);
      return date.toRelative();
    }
    return value;
  }
}
