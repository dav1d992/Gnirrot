import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const now = new Date();
      const date = new Date(value);

      let years = now.getFullYear() - date.getFullYear();
      let months = now.getMonth() - date.getMonth();

      if (months < 0) {
        months += 12;
      }

      let result = '';
      if (years !== 0) result += `${years} years `;
      if (months >= 0) result += `${months} months`;
      result += ' ago';

      return result.trim();
    }
    return value;
  }
}
