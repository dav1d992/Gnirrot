import { Category } from '@models/category';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const categoryActions = createActionGroup({
  source: 'Categories',
  events: {
    'Set categories': props<{ categories: Array<Category> }>(),
    'Get categories': emptyProps(),
    'Get single category': props<{ id: number }>(),
    'Update category': props<Category>(),
  },
});
