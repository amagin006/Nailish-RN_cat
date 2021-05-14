import BasePresenter from '~/modules/bases/models/BasePresenter';
import {
  ICustomerListItem,
  CustomerListPresenterInterface,
  CustomerListRepositoryInterface,
} from '~/modules/customerList/CustomerListInterfaces';

import CustomerModel from '~/modules/customer/services/cusomerModels';
import { UserInterface } from '~/redux/user/types';
import { db } from '~/config/Firebase';

export default class CustomerListPresenter
  extends BasePresenter
  implements CustomerListPresenterInterface
{
  private CustomerListRepository: CustomerListRepositoryInterface;

  // constructor
  constructor(customerListRepository: CustomerListRepositoryInterface) {
    super();
    this.CustomerListRepository = customerListRepository;
  }

  /**
   * get customerList
   */
  public getCustomerList = async (user: UserInterface) => {
    try {
      let newCustomerList: ICustomerListItem[] = [];
      const data = await this.CustomerListRepository.fetchCustomerList(user);
      data.forEach(doc => {
        const id = doc.id;
        const newCustomer = new CustomerModel({ id, ...doc.data() });

        if (newCustomerList.length === 0) {
          newCustomerList.push({ initial: newCustomer.firstLetter, data: [newCustomer] });
        } else {
          let findRow;
          newCustomerList.map(row => {
            if (row.initial === newCustomer.firstLetter) {
              row?.data && row.data.push(newCustomer);
              findRow = true;
              return;
            }
          });
          !findRow &&
            newCustomerList.push({ initial: newCustomer.firstLetter, data: [newCustomer] });
        }
      });
      return newCustomerList || [];
    } catch (err) {
      console.log('Error firebase: ', err);
      return [];
    }
  };
}
