import { Component, OnInit } from '@angular/core';
import { Product } from '@models/product';
import { ProductsService } from '@services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
    });
  }

  filterProducts(filterValue: any) {
    if (!filterValue) {
      this.loadProducts();
    } else {
      this.productsService.getProducts().subscribe({
        next: (products) => {
          this.products = products.filter((product) =>
            product.name
              .toLowerCase()
              .includes(filterValue.target.value.toLowerCase())
          );
        },
      });
    }
  }
}