import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '@models/category';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl;
  categories: Category[] = [];

  constructor(private http: HttpClient) {}

  getCategories() {
    if (this.categories.length > 0) return of(this.categories);
    return this.http.get<Category[]>(this.baseUrl + 'categories').pipe(
      map((categories) => {
        this.categories = categories;
        return categories;
      })
    );
  }
}
