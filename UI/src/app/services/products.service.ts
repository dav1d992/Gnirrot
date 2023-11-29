import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '@models/product';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  baseUrl = environment.apiUrl;
  products: Product[] = [];

  constructor(private http: HttpClient) {}

  getProducts() {
    if (this.products.length > 0) return of(this.products);
    return this.http.get<Product[]>(this.baseUrl + 'products').pipe(
      map((products) => {
        this.products = products;
        return products;
      })
    );
  }

  getProduct(id: number) {
    const product = this.products.find((x) => x.id === id);
    if (product) return of(product);
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  updateProduct(product: Product) {
    return this.http.put(this.baseUrl + 'products', product).pipe(
      map(() => {
        const index = this.products.indexOf(product);
        this.products[index] = { ...this.products[index], ...product };
      })
    );
  }
}
