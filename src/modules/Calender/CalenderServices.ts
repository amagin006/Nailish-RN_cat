import { UserInterface } from '~/redux/user/types';
import { ICustomerReport } from '../Customer/CustomerListInterfaces';
import { CalenderRepository } from './CalenderRepository';

interface CalenderServices {
  getCalenderItems: (user: UserInterface) => Promise<ICustomerReport[]>;
}

export const CalenderServices: CalenderServices = {
  getCalenderItems: async user => {
    return await CalenderRepository.getCalenderItems(user);
  },
};
