import { Category } from './category';
import { Material } from './material';
import { Photo } from './photo';
import { User } from './user';

export interface Product {
  id: number;
  name: string;
  photoUrl: string;
  price: number;
  category: Category;
  photos: Photo[];
  materials: Material[];
  created: Date;
  started?: Date;
  ended?: Date;
  employee: User;
}
