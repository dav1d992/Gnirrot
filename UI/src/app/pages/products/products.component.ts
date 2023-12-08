import { Component, OnInit, inject } from '@angular/core';
import { Category } from '@models/category';
import { Product } from '@models/product';
import { CategoryService } from '@services/category.service';
import { ProductsService } from '@services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoryService);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: Category = <Category>{ id: 0, name: 'All' };
  categoryOptions: Category[] = [<Category>{ id: 0, name: 'All' }];
  filterText: string = '';

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  get productsToDisplay() {
    return this.filteredProducts.length > 0 ||
      this.selectedCategory.id !== 0 ||
      this.filterText !== ''
      ? this.filteredProducts
      : this.allProducts;
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
      },
    });
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categoryOptions.push(...categories);
      },
    });
  }

  filterProducts(filterValue: any) {
    this.filterText = filterValue.target.value.toLowerCase();

    this.filteredProducts = this.allProducts.filter(
      (product) =>
        (this.selectedCategory.id === 0 ||
          product.category.name === this.selectedCategory.name) &&
        product.name.toLowerCase().includes(this.filterText)
    );
  }

  filterProductsByCategory(category: Category) {
    this.filteredProducts = this.allProducts.filter(
      (product) =>
        (category.id === 0 || product.category.name === category.name) &&
        product.name.toLowerCase().includes(this.filterText)
    );
  }
}
