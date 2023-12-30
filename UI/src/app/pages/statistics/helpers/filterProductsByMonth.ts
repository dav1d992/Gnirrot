import { Product } from '@models/product';

export function filterProductsByMonth(
  products: Product[],
  month: number,
  year: number
): Product[] {
  return products.filter((product) => {
    return (
      product.created.getMonth() === month &&
      product.created.getFullYear() === year
    );
  });
}
