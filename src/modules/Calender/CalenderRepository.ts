import { db } from '~/config/Firebase';
import { UserInterface } from '~/redux/user/types';
import { ICustomerReport } from '../Customer/CustomerListInterfaces';

interface CalenderRepository {
  getCalenderItems: (user: UserInterface) => Promise<ICustomerReport[]>;
}

export const CalenderRepository: CalenderRepository = {
  getCalenderItems: async user => {
    try {
      const data = await db
        .collection('users')
        .doc(`${user.uid}`)
        .collection('report')
        .orderBy('date.dateString')
        .get();

      let calenderItems: ICustomerReport[] = [];
      data.forEach(doc => {
        calenderItems.push(doc.data() as ICustomerReport);
      });
      console.log('calenderItems', calenderItems);
      return calenderItems;
    } catch (err) {
      console.log('Error fetchCustomerList: ', err);
      throw new Error('Error fetchCustomerList on CustomerListRepository');
    }
    return [];
  },
};
