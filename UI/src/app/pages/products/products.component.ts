import { Component, OnInit, inject } from '@angular/core';
import { Category } from '@models/category';
import { Product } from '@models/product';
import { CategoryService } from '@services/category.service';
import { ProductService } from '@services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoriesService = inject(CategoryService);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: Category = <Category>{ id: 0, name: 'All' };
  selectedStatus: { label: string; value: string } = {
    label: 'All',
    value: 'All',
  };
  categoryOptions: Category[] = [<Category>{ id: 0, name: 'All' }];
  filterText: string = '';
  statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Created', value: 'Created' },
    { label: 'Started', value: 'Started' },
    { label: 'Ended', value: 'Ended' },
  ];
  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  get productsToDisplay() {
    return this.selectedCategory.id === 0 &&
      this.selectedStatus.value === 'All' &&
      this.filterText === ''
      ? this.allProducts
      : this.filteredProducts;
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
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

  filterProducts(filterValue?: any) {
    if (filterValue) {
      this.filterText = filterValue.target.value.toLowerCase();
    }

    this.filteredProducts = this.allProducts
      .filter(
        (product) =>
          (this.selectedCategory.id === 0 ||
            product.category.name === this.selectedCategory.name) &&
          product.name.toLowerCase().includes(this.filterText)
      )
      .filter((product) => {
        switch (this.selectedStatus.value) {
          case 'Created':
            return !product.started; // Assuming 'started' is null or undefined if not set
          case 'Started':
            return product.started && !product.ended; // Has a start date but no end date
          case 'Ended':
            return !!product.ended; // Has an end date
          default:
            return true; // No filter or an unrecognized status
        }
      });
  }
}
