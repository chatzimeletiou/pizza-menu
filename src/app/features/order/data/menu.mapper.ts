import { itemPrices, items, itemSizes } from './data';
import { MenuItemViewModel } from '../models/menu.models';

// Converts the initial data into the structure used by the UI
export function buildMenuItems(): MenuItemViewModel[] {
  const sizeNameById = new Map(
    itemSizes.map(size => [size.sizeId, size.name])
  );

  return items.map(item => ({
    itemId: item.itemId,
    name: item.name,
    sizes: itemPrices
      .filter(itemPrice => itemPrice.itemId === item.itemId)
      .map(itemPrice => ({
        sizeId: itemPrice.sizeId,
        name: sizeNameById.get(itemPrice.sizeId) ?? 'Unknown size',
        selected: true,
        price: itemPrice.price
      }))
  }));
}