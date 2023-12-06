import { Category } from './category';
import { Photo } from './photo';

export interface Product {
  id: number;
  name: string;
  photoUrl: string;
  price: number;
  amountInStock: number;
  category: Category;
  photos: Photo[];
}
