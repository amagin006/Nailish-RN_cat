import BaseRepository from '~/modules/bases/models/BaseRepository';
import {
  IMenuItem,
  MenuPresenterInterface,
  MenuRepositoryInterface,
} from '~/modules/Menu/MenuInterfaces';

export default class MenuRepository extends BaseRepository implements MenuRepositoryInterface {
  // constructor
  constructor() {
    super();
  }

  addMenuItem = async () => {};
  deleteMenuItem = async () => {};
  editMenuItem = async () => {};
  getMenuItemList = async () => {};
}
