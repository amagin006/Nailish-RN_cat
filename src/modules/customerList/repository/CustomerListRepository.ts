import BaseRepository from '~/modules/bases/models/BaseRepository';
import { CustomerListRepositoryInterface } from '~/modules/customerList/CustomerListInterfaces';

import { db } from '~/config/Firebase';
import firebase from '~/config/Firebase';
import CustomerModel from '~/modules/customer/services/cusomerModels';

export default class CustomerListRepository
  extends BaseRepository
  implements CustomerListRepositoryInterface {
  constructor() {
    super();
  }

  public async fetchCustomerList(user) {
    try {
      return await db
        .collection('users')
        .doc(`${user.uid}`)
        .collection('customer')
        .orderBy('firstName')
        .get();
    } catch (err) {
      console.log('Error fetchCustomerList: ', err);
      throw new Error('Error fetchCustomerList');
    }
  }
}
