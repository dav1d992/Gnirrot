import { Component, computed, inject } from '@angular/core';
import { Category } from '@models/category';
import { Product } from '@models/product';
import { Store } from '@ngrx/store';
import { selectAllCategories } from '@store/category/category.selectors';
import { selectAllProducts } from '@store/product/product.selectors';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  private readonly store = inject(Store);

  private storeProducts = this.store.selectSignal(selectAllProducts);
  private storeCategories = this.store.selectSignal(selectAllCategories);

  public filteredProducts: Product[] = [];
  public selectedCategory: Category = <Category>{ id: 0, name: 'All' };
  public selectedStatus: { label: string; value: string } = {
    label: 'All',
    value: 'All',
  };
  public filterText: string = '';
  public statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Created', value: 'Created' },
    { label: 'Started', value: 'Started' },
    { label: 'Ended', value: 'Ended' },
  ];

  public categoryOptions = computed(() => {
    const categories = this.storeCategories();

    if (categories.some((category) => category.id !== 0)) {
      categories.unshift(<Category>{ id: 0, name: 'All' });
      return categories;
    } else {
      return [];
    }
  });

  get productsToDisplay() {
    return this.selectedCategory.id === 0 &&
      this.selectedStatus.value === 'All' &&
      this.filterText === ''
      ? this.storeProducts()
      : this.filteredProducts;
  }

  public filterProducts(filterValue?: any) {
    if (filterValue) {
      this.filterText = filterValue.target.value.toLowerCase();
    }

    this.filteredProducts = this.storeProducts()
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
