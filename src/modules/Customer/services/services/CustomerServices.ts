import { UserInterface } from '~/redux/user/types';
import CustomerModel from '../CustomerModels';
import { CustomerRepository } from '../reporsitory/CustomerRepository';

interface ICustomerServices {
  getCustomer: (user: UserInterface, customerId: string) => Promise<CustomerModel | null>;
}

export const CustomerServices: ICustomerServices = {
  getCustomer: async (user, customerId) => {
    return await CustomerRepository.getCustomer(user, customerId);
  },
};
