import BasePresenter from '~/modules/bases/models/BasePresenter';
import {
  IMenuItem,
  MenuPresenterInterface,
  MenuRepositoryInterface,
} from '~/modules/Menu/MenuInterfaces';

export default class MenuPresenter extends BasePresenter implements MenuPresenterInterface {
  private MenuRepository: MenuRepositoryInterface;

  // constructor
  constructor(menuRepository: MenuRepositoryInterface) {
    super();
    this.MenuRepository = menuRepository;
  }

  addMenuItem = async (user, menuItems) => {
    const isSuccess = await this.MenuRepository.addMenuItem(user, menuItems);
    console.log('presenter isSuccess', isSuccess);
    return isSuccess;
  };
  deleteMenuItem = async () => {};
  updateMenuItem = async () => {};
  getMenuItemList = async user => {
    const menuItems = await this.MenuRepository.getMenuItemList(user);
    return menuItems;
  };
}
