import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '@models/product';
import { catchError, map, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private products: Product[] = [];

  public getProducts() {
    if (this.products.length > 0) return of(this.products);
    return this.http.get<any[]>(this.baseUrl + 'products').pipe(
      map((products) => {
        this.products = products.map((product) => ({
          ...product,
          created: new Date(product.created),
          started: new Date(product.started),
          ended: new Date(product.ended),
        }));
        return this.products;
      })
    );
  }

  public getProduct(id: number) {
    const product = this.products.find((x) => x.id === id);
    if (product) return of(product);
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  public updateProduct(product: Product) {
    const request = {
      id: product.id,
      name: product.name,
      price: product.price,
      photoUrl: product.photoUrl,
      created: product.created.toISOString().split('T')[0],
      started: product.started?.toISOString().split('T')[0],
      ended: product.ended?.toISOString().split('T')[0],
      category: product.category,
      categoryName: product.category.name,
      photos: product.photos,
      materials: product.materials,
      employee: product.employee,
    };

    return this.http.put(this.baseUrl + 'products', request).pipe(
      catchError((error) => {
        console.error('Error occurred while updating product:', error);
        return throwError(error);
      })
    );
  }
}
