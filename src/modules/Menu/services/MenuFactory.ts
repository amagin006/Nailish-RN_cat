import { MenuPresenterInterface, MenuRepositoryInterface } from '~/modules/Menu/MenuInterfaces';

import MenuPresenter from '~/modules/Menu/services/MenuPresenter';
import MenuRepository from '~/modules/Menu/repository/MenuRepository';

export default class CustomerListFactory {
  public static menuPresenter: MenuPresenterInterface;
  public static menuRepository: MenuRepositoryInterface;

  public static set() {
    CustomerListFactory.menuRepository = new MenuRepository();
    CustomerListFactory.menuPresenter = new MenuPresenter(CustomerListFactory.menuRepository);
  }

  // to get presenter
  public static getCustomerListRepository(): MenuPresenterInterface {
    return CustomerListFactory.menuPresenter;
  }
}

CustomerListFactory.set();
