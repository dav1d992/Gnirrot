import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '@models/photo';
import { Product } from '@models/product';
import { Store } from '@ngrx/store';
import { ProductService } from '@services/product.service';
import { selectAllProducts } from '@store/product/product.selectors';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  private storeProducts = this.store.selectSignal(selectAllProducts);

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  public product = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.storeProducts().find((product) => product.id.toString() === id);
  });

  public images = computed(() => {
    if (this.product() === undefined) return [];
    const imageUrls = [];
    for (const photo of this.product()!.photos) {
      imageUrls.push(photo);
      imageUrls.push(photo);
      imageUrls.push(photo);
      imageUrls.push(photo);
    }
    return imageUrls;
  });
}
