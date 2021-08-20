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
      console.log('Error update image', err);
      return false;
    }
  };
  deleteMenuItem = async () => {};
  updateMenuItem = async () => {};
  getMenuItemList = async () => {};
}
