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

  addMenuItem = async () => {};
  deleteMenuItem = async () => {};
  editMenuItem = async () => {};
  getMenuItemList = async () => {};
}
