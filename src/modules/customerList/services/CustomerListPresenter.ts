import BasePresenter from '~/modules/bases/models/BasePresenter';
import {
  ICustomerListItem,
  CustomerListPresenterInterface,
  CustomerListRepositoryInterface,
} from '~/modules/CustomerList/CustomerListInterfaces';

import CustomerModel, { ICustomer } from '~/modules/Customer/services/CusomerModels';
import { UserInterface } from '~/redux/user/types';

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

  /**
   * upLoadPhoto
   */
  public async upLoadPhoto(user: UserInterface, customerId?: string, imageUrl?: string) {
    const downloadURL = await this.CustomerListRepository.upLoadPhoto(user, customerId, imageUrl);
    return downloadURL;
  }

  /**
   * updateCustomer
   */
  public async updateCustomer(user: UserInterface, updateCustomer: ICustomer) {
    await this.CustomerListRepository.updateCustomer(user, updateCustomer);
  }

  /**
   * deleteCustomer
   */
  public async deleteCustomer(user: UserInterface, customerId: string) {
    return await this.CustomerListRepository.deleteCustomer(user, customerId);
  }
}
