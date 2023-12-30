import { Product } from '@models/product';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const productActions = createActionGroup({
  source: 'Products',
  events: {
    'Set products': props<{ products: Array<Product> }>(),
    'Get products': emptyProps(),
    'Get single product': props<{ id: number }>(),
    'Update product': props<Product>(),
  },
});
