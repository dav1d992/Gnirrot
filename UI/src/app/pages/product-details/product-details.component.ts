import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '@models/photo';
import { Product } from '@models/product';
import { ProductsService } from '@services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);

  product: Product | undefined;
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
  images: Photo[] = [];

  ngOnInit(): void {
    this.loadProduct();
  }

  getImages() {
    if (!this.product) return [];
    const imageUrls = [];
    for (const photo of this.product.photos) {
      imageUrls.push(photo);
    }
    return imageUrls;
  }

  loadProduct() {
    var id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.productsService.getProduct(Number(id)).subscribe({
      next: (product) => {
        this.product = product;
        this.images = this.getImages();
      },
    });
  }
}
