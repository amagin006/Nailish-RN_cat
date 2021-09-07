import { MenuPresenterInterface, MenuRepositoryInterface } from '~/modules/Menu/MenuInterfaces';

import MenuPresenter from '~/modules/Menu/services/MenuPresenter';
import MenuRepository from '~/modules/Menu/repository/MenuRepository';

export default class MenuFactory {
  public static menuPresenter: MenuPresenterInterface;
  public static menuRepository: MenuRepositoryInterface;

  public static set() {
    MenuFactory.menuRepository = new MenuRepository();
    MenuFactory.menuPresenter = new MenuPresenter(MenuFactory.menuRepository);
  }

  // to get presenter
  public static getMenuPresenter(): MenuPresenterInterface {
    return MenuFactory.menuPresenter;
  }
}

MenuFactory.set();
