import { Component, OnInit, inject } from '@angular/core';
import { Material } from '@models/material';
import { MaterialType } from '@models/material-type';
import { Product } from '@models/product';
import { MaterialTypeService } from '@services/material-type.service';
import { MaterialService } from '@services/material.service';
import { ProductService } from '@services/product.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
})
export class MaterialsComponent implements OnInit {
  private readonly materialService = inject(MaterialService);
  private readonly materialTypesService = inject(MaterialTypeService);
  private readonly productService = inject(ProductService);

  public allProducts: Product[] = [];
  public allMaterials: Material[] = [];
  public filteredMaterials: Material[] = [];
  public selectedMaterialType: MaterialType = <MaterialType>{
    id: 0,
    name: 'All',
  };
  public materialTypeOptions: MaterialType[] = [
    <MaterialType>{ id: 0, name: 'All' },
  ];
  public filterText: string = '';

  ngOnInit() {
    this.loadProducts();
    this.loadMaterials();
    this.loadMaterialTypes();
  }

  get materialsToDisplay() {
    return this.filteredMaterials.length > 0 ||
      this.selectedMaterialType.id !== 0 ||
      this.filterText !== ''
      ? this.filteredMaterials
      : this.allMaterials;
  }

  public loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
      },
    });
  }

  public loadMaterials() {
    this.materialService.getMaterials().subscribe({
      next: (materials) => {
        this.allMaterials = materials;
      },
    });
  }

  public loadMaterialTypes() {
    this.materialTypesService.getMaterialTypes().subscribe({
      next: (materialTypes) => {
        this.materialTypeOptions.push(...materialTypes);
      },
    });
  }

  public filterMaterials(filterValue: any) {
    this.filterText = filterValue.target.value.toLowerCase();

    this.filteredMaterials = this.allMaterials.filter(
      (material) =>
        (this.selectedMaterialType.id === 0 ||
          material.materialType.name === this.selectedMaterialType.name) &&
        material.name.toLowerCase().includes(this.filterText)
    );
  }

  public filterMaterialsByMaterialType(materialType: MaterialType) {
    this.filteredMaterials = this.allMaterials.filter(
      (material) =>
        (materialType.id === 0 ||
          material.materialType.name === materialType.name) &&
        material.name.toLowerCase().includes(this.filterText)
    );
  }

  public neededAmountOfMaterial(material: Material): number {
    let total = 0;
    for (const product of this.allProducts) {
      for (const mat of product.materials) {
        if (mat.id === material.id) {
          total++;
        }
      }
    }

    return total;
  }
}
