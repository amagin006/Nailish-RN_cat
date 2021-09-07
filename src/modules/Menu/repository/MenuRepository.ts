import BaseRepository from '~/modules/bases/models/BaseRepository';
import {
  IMenuItem,
  MenuPresenterInterface,
  MenuRepositoryInterface,
} from '~/modules/Menu/MenuInterfaces';

import { db } from '~/config/Firebase';

export default class MenuRepository extends BaseRepository implements MenuRepositoryInterface {
  // constructor
  constructor() {
    super();
  }

  addMenuItem = async (user, menuItem) => {
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
  };
  deleteMenuItem = async () => {};
  updateMenuItem = async () => {};
  getMenuItemList = async user => {
    let items: IMenuItem[] = [];
    try {
      const res = await db.collection('users').doc(`${user.uid}`).collection('menu').get();
      if (!res) {
        return items;
      }
      res.forEach(doc => {
        console.log(doc.id, ' ==> ', doc.data());
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
  };
}
