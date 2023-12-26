import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Material } from '@models/material';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private readonly http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  materials: Material[] = [];

  getMaterials() {
    if (this.materials.length > 0) return of(this.materials);
    return this.http.get<Material[]>(this.baseUrl + 'materials').pipe(
      map((materials) => {
        this.materials = materials;
        return materials;
      })
    );
  }

  getMaterial(id: number) {
    const material = this.materials.find((material) => material.id === id);
    if (material) return of(material);
    return this.http.get<Material>(this.baseUrl + 'materials/' + id);
  }

  updateMaterial(material: Material) {
    return this.http.put(this.baseUrl + 'materials', material).pipe(
      map(() => {
        const index = this.materials.indexOf(material);
        this.materials[index] = { ...this.materials[index], ...material };
      })
    );
  }
}
