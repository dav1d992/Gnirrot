import { MaterialType } from './material-type';

export interface Material {
  id: number;
  name: string;
  price: number;
  amountInStock: number;
  width: number;
  height: number;
  length: number;
  materialTypeName: string;
  materialType: MaterialType;
}
