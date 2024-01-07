import { Component, computed, effect, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from '@models/category';
import { Material } from '@models/material';
import { Product } from '@models/product';
import { User } from '@models/user';
import { Store } from '@ngrx/store';
import { selectAllCategories } from '@store/category/category.selectors';
import { selectAllMaterials } from '@store/material/material.selectors';
import { productActions } from '@store/product';
import { selectAllProducts } from '@store/product/product.selectors';
import { selectAllUsers } from '@store/user/user.selectors';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  private storeProducts = this.store.selectSignal(selectAllProducts);
  public storeCategories = this.store.selectSignal(selectAllCategories);
  public storeMaterials = this.store.selectSignal(selectAllMaterials);
  public storeUsers = this.store.selectSignal(selectAllUsers);
  public productDetailsForm: FormGroup;

  public selectedMaterials: Material[] = [];

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

  get materialsControl() {
    return this.productDetailsForm.get('materials') as FormArray;
  }

  onMaterialSelect(material: Material) {
    console.log('🚀 ~ material:', material);
    // Add the selected material to the form control value
    this.materialsControl.value.push(material);
    this.materialsControl.updateValueAndValidity(); // Update the validity status of the control
  }

  removeMaterial(index: number) {
    // Remove the material from the form control value
    this.materialsControl.value.splice(index, 1);
    this.materialsControl.updateValueAndValidity();
  }

  constructor() {
    this.productDetailsForm = new FormGroup({
      name: new FormControl(this.product()?.name, Validators.required),
      photoUrl: new FormControl(this.product()?.photoUrl, Validators.required),
      price: new FormControl(this.product()?.price, Validators.required),
      category: new FormControl(this.product()?.category, Validators.required),
      materials: new FormArray(
        this.product()?.materials.map(
          (material) => new FormControl(material)
        ) || [],
        Validators.required
      ),
      created: new FormControl(this.product()?.created, Validators.required),
      started: new FormControl(this.product()?.started, Validators.required),
      ended: new FormControl(this.product()?.ended, Validators.required),
      employee: new FormControl(this.product()?.employee, Validators.required),
    });

    effect(() => {
      if (this.product()) {
        this.selectedMaterials = this.product()!.materials;
        this.productDetailsForm = new FormGroup({
          name: new FormControl(this.product()!.name, Validators.required),
          photoUrl: new FormControl(
            this.product()!.photoUrl,
            Validators.required
          ),
          price: new FormControl(this.product()!.price, Validators.required),
          category: new FormControl(
            this.product()!.category,
            Validators.required
          ),
          materials: new FormArray(
            this.product()!.materials.map(
              (material) => new FormControl(material)
            ),
            Validators.required
          ),
          created: new FormControl(
            new Date(this.product()!.created),
            Validators.required
          ),
          started: new FormControl(
            this.product()!.started
              ? new Date(this.product()!.started!)
              : undefined,
            Validators.required
          ),
          ended: new FormControl(
            this.product()!.ended
              ? new Date(this.product()!.ended!)
              : undefined,
            Validators.required
          ),
          employee: new FormControl(
            this.product()!.employee,
            Validators.required
          ),
        });
      }
    });
  }

  public onSubmit() {
    const utcDateCreated = new Date(
      Date.UTC(
        this.product()!.created.getFullYear(),
        this.product()!.created.getMonth(),
        this.product()!.created.getDate()
      )
    );
    const utcDateStarted = new Date(
      Date.UTC(
        this.productDetailsForm.value.started.getFullYear(),
        this.productDetailsForm.value.started.getMonth(),
        this.productDetailsForm.value.started.getDate()
      )
    );
    const utcDateEnded = new Date(
      Date.UTC(
        this.productDetailsForm.value.ended.getFullYear(),
        this.productDetailsForm.value.ended.getMonth(),
        this.productDetailsForm.value.ended.getDate()
      )
    );

    const request: Product = {
      id: this.product()!.id,
      name: this.productDetailsForm.value.name as string,
      photoUrl: this.productDetailsForm.value.photoUrl as string,
      price: this.productDetailsForm.value.price as number,
      category: this.productDetailsForm.value.category as Category,
      materials: this.productDetailsForm.value.materials as Material[],
      created: utcDateCreated,
      started: utcDateStarted,
      ended: utcDateEnded,
      employee: this.productDetailsForm.value.employee as User,
      photos: this.product()!.photos,
    };
    this.store.dispatch(productActions.updateProduct(request));
  }
}
