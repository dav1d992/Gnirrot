import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MaterialType } from '@models/material-type';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaterialTypeService {
  private readonly http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  materialTypes: MaterialType[] = [];

  getMaterialTypes() {
    if (this.materialTypes.length > 0) return of(this.materialTypes);
    return this.http.get<MaterialType[]>(this.baseUrl + 'materialtypes').pipe(
      map((materialTypes) => {
        this.materialTypes = materialTypes;
        return materialTypes;
      })
    );
  }
}
