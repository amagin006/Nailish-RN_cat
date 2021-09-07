import { EChangeAmountType } from '~/components/molecules/MenuListMolecules/SelectMenuListItemMolecules';
import { IMenuItem, IMenuListItem } from '~/modules/Menu/MenuInterfaces';

// Initialaze amount
export const InitializeItemAmount = (items: IMenuItem[]): IMenuListItem[] => {
  if (!items || !Array.isArray(items)) return [];
  const listItems = items.map(item => {
    return {
      amount: 0,
      ...item,
    };
  });
  return listItems;
};

// change amount of menuItem
export const ChnageItemAmount = (
  item: IMenuListItem,
  type: EChangeAmountType,
  currentItems: IMenuListItem[],
): IMenuListItem[] => {
  const newItems = currentItems.map(listItem => {
    if (listItem.id === item.id) {
      if (type === EChangeAmountType.ADD) {
        return {
          ...listItem,
          amount: listItem.amount + 1,
        };
      } else if (type === EChangeAmountType.MINUS && listItem.amount > 0) {
        return {
          ...listItem,
          amount: listItem.amount - 1,
        };
      }
    }
    return listItem;
  });
  return newItems;
};

// to update SelectMenuList items
export const UpdateMenuList = (items: IMenuItem[], menuItems: IMenuListItem[]): IMenuListItem[] => {
  return items.map(item => {
    const newItem = menuItems.find(currentListItem => currentListItem.id === item.id);
    // if already listed, return previous list item
    if (newItem) {
      return newItem;
    } else {
      // if new item, return amount 0
      return {
        ...item,
        amount: 0,
      };
    }
  });
};
