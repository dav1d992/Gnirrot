import { Photo } from './photo';

export interface Product {
  id: number;
  name: string;
  photoUrl: string;
  price: number;
  amountInStock: number;
  categoryName: string;
  category: string;
  photos: Photo[];
}
