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
    const monthCreated = product.created.toFormat('LLL').toUpperCase();
    const monthStarted = product.started.toFormat('LLL').toUpperCase();
    const monthEnded = product.ended.toFormat('LLL').toUpperCase();

    if (!monthStats.has(monthCreated)) {
      monthStats.set(monthCreated, {
        amountCreated: 0,
        amountEnded: 0,
        amountStarted: 0,
      });
    }
    if (!monthStats.has(monthStarted)) {
      monthStats.set(monthStarted, {
        amountCreated: 0,
        amountEnded: 0,
        amountStarted: 0,
      });
    }
    if (!monthStats.has(monthEnded)) {
      monthStats.set(monthEnded, {
        amountCreated: 0,
        amountEnded: 0,
        amountStarted: 0,
      });
    }

    monthStats.get(monthCreated)!.amountCreated++;
    monthStats.get(monthStarted)!.amountStarted++;
    monthStats.get(monthEnded)!.amountEnded++;
  });

  const result = Array.from(monthStats, ([month, counts]) => ({
    monthCreated: month,
    ...counts,
  }));

  return result;
}
