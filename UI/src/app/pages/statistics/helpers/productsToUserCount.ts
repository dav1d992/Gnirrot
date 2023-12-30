import { Product } from '@models/product';
import { User } from '@models/user';

export function productsToUserCount(
  products: Product[],
  totalUsers: User[]
): { userShortName: string; noOfProducts: number }[] {
  const userProductCountMap = new Map<string, number>();

  // Initialize all users with a count of 0
  totalUsers.forEach((user) => {
    userProductCountMap.set(user?.shortName, 0);
  });

  // Increment counts for users with associated products
  products.forEach((product) => {
    const shortName = product.employee.shortName;
    userProductCountMap.set(shortName, userProductCountMap.get(shortName)! + 1);
  });

  return Array.from(userProductCountMap, ([userShortName, noOfProducts]) => ({
    userShortName,
    noOfProducts,
  }));
}
