import { Component, OnInit } from '@angular/core';
import { Product } from '@models/product';
import { CategoriesService } from '@services/category.service';
import { ProductsService } from '@services/products.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedCategory: string | null = null;

  categoryOptions: SelectItem[] = [
    { label: 'Category A', value: 'A' },
    { label: 'Category B', value: 'B' },
    { label: 'Category C', value: 'C' },
  ];

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (categories) => {
        this.categoryOptions = categories.map((x) => x.name);
      },
    });
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
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

  filterProductsByCategory(category: string) {
    this.products.filter((product) => product.categoryName === category);
  }
}
