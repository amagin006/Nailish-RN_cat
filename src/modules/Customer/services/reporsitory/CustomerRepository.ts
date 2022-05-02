import CustomerModel from '../CustomerModels';
import { db } from '~/config/Firebase';
import firebase from '~/config/Firebase';
import { UserInterface } from '~/redux/user/types';

interface ICustomerRepository {
  getCustomer: (user: UserInterface, customerId: string) => Promise<CustomerModel | null>;
}

export const CustomerRepository: ICustomerRepository = {
  getCustomer: async (user, customerId) => {
    const data = await db
      .collection('users')
      .doc(`${user.uid}`)
      .collection('customer')
      .doc(`${customerId}`)
      .get();

    console.log('data======>>>>', data, data.exists);
    // let newCustomer: UserInterfaceCustomer;
    if (data.exists) {
      const id = data.id;
      const newCustomer = new CustomerModel({ id, ...data.data() });
      console.log('newCustomer======>>>>', newCustomer);
      return newCustomer;
    }
    return null;
  },
};
