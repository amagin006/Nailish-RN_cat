import {
  CustomerListPresenterInterface,
  CustomerListRepositoryInterface,
} from '~/modules/customerList/CustomerListInterfaces';

import CustomerListPresenter from '~/modules/customerList/services/CustomerListPresenter';
import CustomerListRepository from '~/modules/customerList/repository/CustomerListRepository';

export default class CustomerListFactory {
  public static custmerListPresenter: CustomerListPresenterInterface;
  public static customerListRepository: CustomerListRepositoryInterface;

  public static set() {
    CustomerListFactory.customerListRepository = new CustomerListRepository();
    CustomerListFactory.custmerListPresenter = new CustomerListPresenter(
      CustomerListFactory.customerListRepository,
    );
  }

  // to get presenter
  public static getCustomerListRepository(): CustomerListPresenterInterface {
    return CustomerListFactory.custmerListPresenter;
  }
}

CustomerListFactory.set();
