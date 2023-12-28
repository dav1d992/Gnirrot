import { DateTime } from 'luxon';
import { Category } from './category';
import { Material } from './material';
import { Photo } from './photo';
import { User } from './user';

export interface Product {
  id: number;
  name: string;
  photoUrl: string;
  price: number;
  amountInStock: number;
  category: Category;
  photos: Photo[];
  materials: Material[];
  created: DateTime;
  started: DateTime;
  ended?: DateTime;
  employee: User;
}
