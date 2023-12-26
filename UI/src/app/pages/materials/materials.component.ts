import { Component, OnInit, inject } from '@angular/core';
import { Material } from '@models/material';
import { MaterialType } from '@models/material-type';
import { MaterialTypeService } from '@services/material-type.service';
import { MaterialService } from '@services/material.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
})
export class MaterialsComponent implements OnInit {
  private readonly materialService = inject(MaterialService);
  private readonly materialTypesService = inject(MaterialTypeService);

  allMaterials: Material[] = [];
  filteredMaterials: Material[] = [];
  selectedMaterialType: MaterialType = <MaterialType>{ id: 0, name: 'All' };
  materialTypeOptions: MaterialType[] = [<MaterialType>{ id: 0, name: 'All' }];
  filterText: string = '';

  ngOnInit() {
    this.loadMaterials();
    this.loadCategories();
  }

  get materialsToDisplay() {
    return this.filteredMaterials.length > 0 ||
      this.selectedMaterialType.id !== 0 ||
      this.filterText !== ''
      ? this.filteredMaterials
      : this.allMaterials;
  }

  loadMaterials() {
    this.materialService.getMaterials().subscribe({
      next: (materials) => {
        this.allMaterials = materials;
        console.log('🚀 ~ materials:', materials);
      },
    });
  }

  loadCategories() {
    this.materialTypesService.getCategories().subscribe({
      next: (materialTypes) => {
        this.materialTypeOptions.push(...materialTypes);
      },
    });
  }

  filterMaterials(filterValue: any) {
    this.filterText = filterValue.target.value.toLowerCase();

    this.filteredMaterials = this.allMaterials.filter(
      (material) =>
        (this.selectedMaterialType.id === 0 ||
          material.materialType.name === this.selectedMaterialType.name) &&
        material.name.toLowerCase().includes(this.filterText)
    );
  }

  filterMaterialsByMaterialType(materialType: MaterialType) {
    this.filteredMaterials = this.allMaterials.filter(
      (material) =>
        (materialType.id === 0 ||
          material.materialType.name === materialType.name) &&
        material.name.toLowerCase().includes(this.filterText)
    );
  }
}
