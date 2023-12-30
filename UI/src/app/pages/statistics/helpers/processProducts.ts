import { Product } from '@models/product';

export function processProducts(products: Product[]): {
  monthCreated: string;
  amountCreated: number;
  amountEnded: number;
  amountStarted: number;
}[] {
  const monthStats = new Map<
    string,
    { amountCreated: number; amountEnded: number; amountStarted: number }
  >();

  products.forEach((product) => {
    const monthCreated = product.created
      .toLocaleString('default', { month: 'short' })
      .toUpperCase();
    const monthStarted = product?.started
      ?.toLocaleString('default', { month: 'short' })
      .toUpperCase();
    const monthEnded = product?.ended
      ?.toLocaleString('default', { month: 'short' })
      .toUpperCase();

    if (!monthStats.has(monthCreated)) {
      monthStats.set(monthCreated, {
        amountCreated: 0,
        amountEnded: 0,
        amountStarted: 0,
      });
    }
    if (monthStarted && !monthStats.has(monthStarted)) {
      monthStats.set(monthStarted, {
        amountCreated: 0,
        amountEnded: 0,
        amountStarted: 0,
      });
    }
    if (monthEnded && !monthStats.has(monthEnded)) {
      monthStats.set(monthEnded, {
        amountCreated: 0,
        amountEnded: 0,
        amountStarted: 0,
      });
    }

    monthStats.get(monthCreated)!.amountCreated++;
    if (monthStarted) monthStats.get(monthStarted)!.amountStarted++;
    if (monthEnded) monthStats.get(monthEnded)!.amountEnded++;
  });

  const result = Array.from(monthStats, ([month, counts]) => ({
    monthCreated: month,
    ...counts,
  }));

  return result;
}
