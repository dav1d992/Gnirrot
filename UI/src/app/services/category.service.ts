import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '@models/product';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  baseUrl = environment.apiUrl;
  categories: string[] = [];

  constructor(private http: HttpClient) {}

  getCategories() {
    if (this.categories.length > 0) return of(this.categories);
    return this.http
      .get<{ id: string; name: string }[]>(this.baseUrl + 'categories')
      .pipe(
        map((categories) => {
          this.categories = categories.map((cat) => cat.name);
          return categories;
        })
      );
  }
}
