export interface MenuItemSizeViewModel {
  sizeId: number;
  name: string;
  selected: boolean;
  price: number;
}

export interface MenuItemViewModel {
  itemId: number;
  name: string;
  sizes: MenuItemSizeViewModel[];
}

export interface SizeSelectionChange {
  itemId: number;
  sizeId: number;
  selected: boolean;
}

export interface PriceChange {
  itemId: number;
  sizeId: number;
  price: number;
}