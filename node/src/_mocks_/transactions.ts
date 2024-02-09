import { faker } from '@faker-js/faker';
import categories from './categories';

const categoryList = Object.keys(categories);

function fakeTransaction() {
  return {
    id: faker.string.uuid(),
    date: faker.date.recent({ days: 365 }),
    details: faker.company.name(),
    amount: Number(
      faker.finance.amount({
        min: -10000,
        max: 10000,
        dec: 2,
      }),
    ),
    category: faker.helpers.arrayElement(categoryList),
  };
}

export const transactions = (count: number) => [...Array(count)].map(fakeTransaction);
