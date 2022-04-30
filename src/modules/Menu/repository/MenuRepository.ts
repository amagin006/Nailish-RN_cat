import { IMenuItem } from '~/modules/Menu/MenuInterfaces';

import { db } from '~/config/Firebase';
import { UserInterface } from '~/redux/user/types';

interface MenuRepository {
  addMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<boolean>;
  deleteMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<void>;
  updateMenuItem: (user: UserInterface, menuItem: IMenuItem) => Promise<void>;
  getMenuItemList: (user: UserInterface) => Promise<IMenuItem[]>;
}

export const MenuRepository = {
  addMenuItem: async (user: UserInterface, menuItem: IMenuItem) => {
    try {
      const res = await db.collection('users').doc(`${user.uid}`).collection('menu').add(menuItem);
      if (!res) {
        return false;
      }
      return true;
    } catch (err) {
      console.log('Error MenuRepository update image: ', err);
      return false;
    }
  },
  deleteMenuItem: async () => {},
  updateMenuItem: async () => {},
  getMenuItemList: async (user: UserInterface) => {
    let items: IMenuItem[] = [];
    try {
      const res = await db.collection('users').doc(`${user.uid}`).collection('menu').get();
      if (!res) {
        return items;
      }
      res.forEach(doc => {
        const responseItem = doc.data();
        const item = {
          id: doc.id,
          ...responseItem,
        } as IMenuItem;
        items.push(item);
      });
      return items;
    } catch (err) {
      console.log('Error MenuRepository getMenuItmeList: ', err);
      return items;
    }
  },
};
